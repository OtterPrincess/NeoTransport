import { db } from "./db";
import { 
  mobileMeasurements, 
  mobileMeasurementPoints, 
  transportVibrationIndex,
  InsertTransportVibrationIndex 
} from "@shared/schema";
import { eq, sql, desc } from "drizzle-orm";

export interface TVIAnalysisResult {
  tviScore: number;
  safetyRating: "excellent" | "good" | "fair" | "poor" | "critical";
  riskLevel: "low" | "moderate" | "high" | "critical";
  components: {
    peakVibrationScore: number;
    sustainedVibrationScore: number;
    frequencyPatternScore: number;
  };
  statistics: {
    vibrationVariance: number;
    vibrationStdDev: number;
    smoothnessIndex: number;
  };
  recommendations: string[];
  percentileRank?: number;
  baselineComparison?: number;
}

export class TransportVibrationCalculator {
  
  /**
   * Calculate Transport Vibration Index for a measurement session
   */
  async calculateTVI(measurementId: number): Promise<TVIAnalysisResult> {
    console.log(`Calculating TVI for measurement ID: ${measurementId}`);
    
    // Get measurement details
    const measurement = await db.query.mobileMeasurements.findFirst({
      where: eq(mobileMeasurements.id, measurementId),
      with: {
        points: true,
        unit: true
      }
    });

    if (!measurement) {
      throw new Error(`Measurement ${measurementId} not found`);
    }

    if (!measurement.points || measurement.points.length === 0) {
      throw new Error(`No vibration data points found for measurement ${measurementId}`);
    }

    const points = measurement.points;
    const totalValues = points.map(p => p.total);
    
    // Calculate statistical measures
    const statistics = this.calculateStatistics(totalValues);
    
    // Calculate individual component scores
    const components = {
      peakVibrationScore: this.calculatePeakVibrationScore(totalValues, measurement.peakVibration),
      sustainedVibrationScore: this.calculateSustainedVibrationScore(totalValues, measurement.duration),
      frequencyPatternScore: this.calculateFrequencyPatternScore(points)
    };
    
    // Calculate overall TVI score (weighted combination)
    const tviScore = this.calculateOverallTVIScore(components, statistics);
    
    // Determine safety rating and risk level
    const safetyRating = this.determineSafetyRating(tviScore);
    const riskLevel = this.determineRiskLevel(tviScore, components);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(tviScore, components, statistics);
    
    // Calculate comparative metrics if unit data exists
    let percentileRank: number | undefined;
    let baselineComparison: number | undefined;
    
    if (measurement.unitId) {
      percentileRank = await this.calculatePercentileRank(tviScore, measurement.unitId);
      baselineComparison = await this.calculateBaselineComparison(tviScore, measurement.unitId);
    }
    
    return {
      tviScore,
      safetyRating,
      riskLevel,
      components,
      statistics,
      recommendations,
      percentileRank,
      baselineComparison
    };
  }
  
  /**
   * Save TVI analysis results to database
   */
  async saveTVIAnalysis(measurementId: number, analysis: TVIAnalysisResult, unitId?: number): Promise<number> {
    const tviRecord: InsertTransportVibrationIndex = {
      measurementId,
      unitId,
      tviScore: analysis.tviScore,
      safetyRating: analysis.safetyRating,
      peakVibrationScore: analysis.components.peakVibrationScore,
      sustainedVibrationScore: analysis.components.sustainedVibrationScore,
      frequencyPatternScore: analysis.components.frequencyPatternScore,
      vibrationVariance: analysis.statistics.vibrationVariance,
      vibrationStdDev: analysis.statistics.vibrationStdDev,
      smoothnessIndex: analysis.statistics.smoothnessIndex,
      riskLevel: analysis.riskLevel,
      recommendedActions: JSON.stringify(analysis.recommendations),
      percentileRank: analysis.percentileRank,
      baselineComparison: analysis.baselineComparison,
      analysisVersion: "1.0"
    };
    
    const [result] = await db.insert(transportVibrationIndex).values(tviRecord).returning();
    console.log(`TVI analysis saved with ID: ${result.id}`);
    return result.id;
  }
  
  /**
   * Calculate basic statistical measures
   */
  private calculateStatistics(values: number[]) {
    const n = values.length;
    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    
    // Calculate variance
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    // Calculate smoothness index (inverse of coefficient of variation)
    const coefficientOfVariation = stdDev / mean;
    const smoothnessIndex = Math.max(0, 100 - (coefficientOfVariation * 100));
    
    return {
      vibrationVariance: variance,
      vibrationStdDev: stdDev,
      smoothnessIndex
    };
  }
  
  /**
   * Score based on peak vibration intensity
   */
  private calculatePeakVibrationScore(values: number[], peakVibration: number): number {
    // NICU transport thresholds (based on medical literature)
    const excellent = 0.5;  // < 0.5g excellent
    const good = 1.0;       // 0.5-1.0g good  
    const fair = 2.0;       // 1.0-2.0g fair
    const poor = 3.0;       // 2.0-3.0g poor
    // > 3.0g critical
    
    if (peakVibration <= excellent) return 95;
    if (peakVibration <= good) return 80;
    if (peakVibration <= fair) return 60;
    if (peakVibration <= poor) return 40;
    return 20;
  }
  
  /**
   * Score based on sustained vibration over time
   */
  private calculateSustainedVibrationScore(values: number[], duration: number): number {
    // Calculate percentage of time above warning thresholds
    const warningThreshold = 1.0; // 1g sustained vibration
    const criticalThreshold = 2.0; // 2g sustained vibration
    
    const warningCount = values.filter(v => v > warningThreshold).length;
    const criticalCount = values.filter(v => v > criticalThreshold).length;
    
    const warningPercentage = (warningCount / values.length) * 100;
    const criticalPercentage = (criticalCount / values.length) * 100;
    
    // Penalize sustained high vibration
    let score = 100;
    score -= warningPercentage * 0.5;  // Reduce score by warning percentage
    score -= criticalPercentage * 2;   // Double penalty for critical levels
    
    // Duration penalty for longer exposures
    if (duration > 300) score *= 0.9;  // 5+ minutes
    if (duration > 600) score *= 0.8;  // 10+ minutes
    
    return Math.max(0, score);
  }
  
  /**
   * Score based on vibration pattern consistency
   */
  private calculateFrequencyPatternScore(points: Array<{x: number, y: number, z: number, total: number}>): number {
    if (points.length < 10) return 50; // Insufficient data
    
    // Analyze pattern regularity using autocorrelation
    const totalValues = points.map(p => p.total);
    const autocorr = this.calculateAutocorrelation(totalValues);
    
    // Check for sudden spikes (jerky movement)
    const spikes = this.detectSpikes(totalValues);
    const spikePercentage = (spikes.length / totalValues.length) * 100;
    
    // Base score starts high for smooth patterns
    let score = 90;
    score -= spikePercentage * 2; // Penalize sudden movements
    score += autocorr * 10; // Reward consistent patterns
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Calculate overall TVI score using weighted components
   */
  private calculateOverallTVIScore(components: any, statistics: any): number {
    const weights = {
      peak: 0.4,        // Peak vibration is most critical
      sustained: 0.35,  // Sustained exposure important
      pattern: 0.25     // Pattern consistency matters for comfort
    };
    
    const weightedScore = 
      (components.peakVibrationScore * weights.peak) +
      (components.sustainedVibrationScore * weights.sustained) +
      (components.frequencyPatternScore * weights.pattern);
    
    // Apply smoothness bonus/penalty
    const smoothnessBonus = (statistics.smoothnessIndex - 50) * 0.1;
    
    return Math.max(0, Math.min(100, weightedScore + smoothnessBonus));
  }
  
  /**
   * Determine safety rating from TVI score
   */
  private determineSafetyRating(tviScore: number): "excellent" | "good" | "fair" | "poor" | "critical" {
    if (tviScore >= 85) return "excellent";
    if (tviScore >= 70) return "good";
    if (tviScore >= 55) return "fair";
    if (tviScore >= 35) return "poor";
    return "critical";
  }
  
  /**
   * Determine risk level
   */
  private determineRiskLevel(tviScore: number, components: any): "low" | "moderate" | "high" | "critical" {
    // Risk assessment considers both overall score and peak exposure
    if (tviScore >= 75 && components.peakVibrationScore >= 80) return "low";
    if (tviScore >= 60 && components.peakVibrationScore >= 60) return "moderate";
    if (tviScore >= 40 || components.peakVibrationScore >= 40) return "high";
    return "critical";
  }
  
  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(tviScore: number, components: any, statistics: any): string[] {
    const recommendations: string[] = [];
    
    if (components.peakVibrationScore < 60) {
      recommendations.push("Reduce transport speed and avoid sudden movements");
      recommendations.push("Use enhanced suspension or vibration dampening");
    }
    
    if (components.sustainedVibrationScore < 70) {
      recommendations.push("Minimize transport duration when possible");
      recommendations.push("Consider route optimization to avoid rough surfaces");
    }
    
    if (components.frequencyPatternScore < 60) {
      recommendations.push("Focus on smoother acceleration and deceleration");
      recommendations.push("Train staff on gentle transport techniques");
    }
    
    if (statistics.smoothnessIndex < 40) {
      recommendations.push("Review transport equipment for mechanical issues");
      recommendations.push("Implement additional stabilization measures");
    }
    
    if (tviScore < 50) {
      recommendations.push("IMMEDIATE REVIEW REQUIRED - Consider alternative transport methods");
      recommendations.push("Conduct safety assessment before next transport");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Transport conditions within acceptable safety parameters");
      recommendations.push("Continue current transport protocols");
    }
    
    return recommendations;
  }
  
  /**
   * Calculate percentile rank compared to historical data
   */
  private async calculatePercentileRank(tviScore: number, unitId?: number): Promise<number> {
    try {
      const whereCondition = unitId ? eq(transportVibrationIndex.unitId, unitId) : undefined;
      
      const historicalScores = await db
        .select({ tviScore: transportVibrationIndex.tviScore })
        .from(transportVibrationIndex)
        .where(whereCondition)
        .orderBy(transportVibrationIndex.tviScore);
      
      if (historicalScores.length === 0) return 50; // Default percentile
      
      const lowerCount = historicalScores.filter(s => s.tviScore < tviScore).length;
      return (lowerCount / historicalScores.length) * 100;
    } catch (error) {
      console.error('Error calculating percentile rank:', error);
      return 50;
    }
  }
  
  /**
   * Calculate comparison to unit baseline
   */
  private async calculateBaselineComparison(tviScore: number, unitId: number): Promise<number> {
    try {
      const recentScores = await db
        .select({ tviScore: transportVibrationIndex.tviScore })
        .from(transportVibrationIndex)
        .where(eq(transportVibrationIndex.unitId, unitId))
        .orderBy(desc(transportVibrationIndex.calculatedAt))
        .limit(10);
      
      if (recentScores.length === 0) return 0;
      
      const baseline = recentScores.reduce((sum, s) => sum + s.tviScore, 0) / recentScores.length;
      return ((tviScore - baseline) / baseline) * 100;
    } catch (error) {
      console.error('Error calculating baseline comparison:', error);
      return 0;
    }
  }
  
  /**
   * Calculate autocorrelation for pattern analysis
   */
  private calculateAutocorrelation(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    if (variance === 0) return 1;
    
    let autocorr = 0;
    for (let i = 1; i < values.length; i++) {
      autocorr += (values[i-1] - mean) * (values[i] - mean);
    }
    
    return autocorr / ((values.length - 1) * variance);
  }
  
  /**
   * Detect sudden spikes in vibration data
   */
  private detectSpikes(values: number[]): number[] {
    const spikes: number[] = [];
    const threshold = 2.0; // 2 standard deviations
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
    
    for (let i = 0; i < values.length; i++) {
      if (Math.abs(values[i] - mean) > threshold * stdDev) {
        spikes.push(i);
      }
    }
    
    return spikes;
  }
}

// Export singleton instance
export const tviCalculator = new TransportVibrationCalculator();