import { Router, Request, Response } from 'express';
import { db } from './db';
import { 
  mobileMeasurements, 
  mobileMeasurementPoints, 
  insertMobileMeasurementSchema,
  transportVibrationIndex 
} from '../shared/schema';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';
import { tviCalculator } from './tvi-calculator';

const router = Router();

// Enhanced schema for HIPAA-compliant measurement data
const mobileMeasurementDataSchema = z.object({
  deviceId: z.string(),
  deviceType: z.string().optional().default("Mobile App"),
  sessionId: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  duration: z.number().nonnegative(),
  maxValue: z.number().nonnegative().optional(),
  peakVibration: z.number().nonnegative().optional(),
  description: z.string().optional(),
  dataPoints: z.number().int().nonnegative().optional(),
  averageVibration: z.number().nonnegative().optional(),
  unitId: z.number().optional(),
  readings: z.array(z.object({
    timestamp: z.number().or(z.string()),
    x: z.number(),
    y: z.number(),
    z: z.number(),
    total: z.number()
  })).optional(),
  // HIPAA/security specific fields
  encrypted: z.boolean().optional().default(true),
  secureMode: z.boolean().optional().default(true),
  retentionDays: z.number().int().positive().optional().default(30),
}).transform(data => {
  // If we have maxValue and not peakVibration, use maxValue for peakVibration
  if (data.maxValue !== undefined && data.peakVibration === undefined) {
    data.peakVibration = data.maxValue;
  }
  
  // If we have peakVibration and not maxValue, use peakVibration for maxValue
  if (data.peakVibration !== undefined && data.maxValue === undefined) {
    data.maxValue = data.peakVibration;
  }
  
  // If we have readings array but no dataPoints count, count them
  if (data.readings && data.dataPoints === undefined) {
    data.dataPoints = data.readings.length;
  }
  
  return data;
});

// Schema for batch measurement points
const mobileMeasurementPointsSchema = z.object({
  points: z.array(z.object({
    measurementId: z.number(),
    timestamp: z.string().datetime(),
    xAxis: z.number(),
    yAxis: z.number(),
    zAxis: z.number(),
    totalValue: z.number()
  }))
});

type MobileMeasurementData = z.infer<typeof mobileMeasurementDataSchema>;

// Encrypt sensitive data if requested (for HIPAA compliance)
function encryptIfNeeded(data: string, shouldEncrypt: boolean): string {
  if (!shouldEncrypt) return data;
  
  try {
    // This is a simplified example - in a real app you would use a proper encryption key management system
    const encryptionKey = process.env.ENCRYPTION_KEY || 'nestara-hipaa-compliant-key-2024';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    return data; // Fallback to unencrypted data
  }
}

// POST /api/mobile/measurements - Create a new measurement session
router.post('/measurements', async (req: Request, res: Response) => {
  try {
    // Validate incoming data
    const validationResult = mobileMeasurementDataSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid data format',
        details: validationResult.error.format()
      });
    }
    
    const data = validationResult.data;
    const shouldEncrypt = data.encrypted || false;
    const secureMode = data.secureMode || false;
    
    // Process metadata for HIPAA compliance (remove any PHI)
    let metadata: any = {
      ...req.body.metadata,
      deviceType: data.deviceType,
      secureMode,
      retentionDays: data.retentionDays,
      createdAt: new Date().toISOString(),
      dataFormat: 'accelerometer'
    };
    
    // In secure mode, ensure no PHI is included
    if (secureMode) {
      // Remove any potential PHI from metadata
      delete metadata.patientName;
      delete metadata.patientId;
      delete metadata.medicalRecordNumber;
      delete metadata.dateOfBirth;
      delete metadata.ssn;
    }
    
    // Prepare measurement data with proper typing
    const measurementData = {
      deviceId: data.deviceId,
      sessionId: data.sessionId,
      timestamp: new Date(),
      startTime: new Date(data.startTime),
      duration: data.duration,
      peakVibration: data.peakVibration || data.maxValue || 0,
      averageVibration: data.averageVibration || (data.maxValue ? data.maxValue / 2 : 0),
      dataPoints: data.dataPoints || 0,
      unitId: data.unitId || null,
      metadata: JSON.stringify(metadata),
    };
    
    // Insert the main measurement record
    const [measurement] = await db.insert(mobileMeasurements).values(measurementData).returning();
    
    // If we have readings data, insert them as measurement points
    if (data.readings && data.readings.length > 0) {
      try {
        await db.insert(mobileMeasurementPoints).values(
          data.readings.map(reading => ({
            measurementId: measurement.id,
            timestamp: new Date(typeof reading.timestamp === 'number' 
              ? reading.timestamp 
              : Date.parse(reading.timestamp)),
            x: reading.x,
            y: reading.y,
            z: reading.z,
            total: reading.total
          }))
        );
        console.log(`Inserted ${data.readings.length} measurement points for measurement ID ${measurement.id}`);
      } catch (error) {
        console.error('Error inserting measurement points:', error);
        // Continue anyway since we already created the measurement record
      }
    }
    
    // Calculate TVI for the measurement if we have sufficient data
    let tviAnalysis = null;
    if (data.readings && data.readings.length >= 10) {
      try {
        console.log(`Calculating TVI for measurement ${measurement.id}`);
        tviAnalysis = await tviCalculator.calculateTVI(measurement.id);
        await tviCalculator.saveTVIAnalysis(measurement.id, tviAnalysis, data.unitId);
        console.log(`TVI calculated: ${tviAnalysis.tviScore} (${tviAnalysis.safetyRating})`);
      } catch (error) {
        console.error('Error calculating TVI:', error);
        // Don't fail the entire request if TVI calculation fails
      }
    }

    res.status(201).json({
      success: true,
      id: measurement.id,
      secureMode,
      pointsRecorded: data.readings?.length || 0,
      tviCalculated: tviAnalysis !== null,
      tviScore: tviAnalysis?.tviScore,
      safetyRating: tviAnalysis?.safetyRating,
      message: 'Measurement data recorded successfully'
    });
  } catch (error) {
    console.error('Error recording measurement:', error);
    res.status(500).json({ 
      error: 'Failed to record measurement data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/mobile/measurement-points - Add data points to a measurement
router.post('/measurement-points', async (req: Request, res: Response) => {
  try {
    // Validate the incoming points data
    const validationResult = mobileMeasurementPointsSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid data point format',
        details: validationResult.error.format()
      });
    }
    
    const { points } = validationResult.data;
    
    // Insert the measurement points in batches
    const insertedPoints = await db.insert(mobileMeasurementPoints).values(
      points.map(point => ({
        measurementId: point.measurementId,
        timestamp: new Date(point.timestamp),
        x: point.xAxis,
        y: point.yAxis,
        z: point.zAxis,
        total: point.totalValue
      }))
    ).returning({ id: mobileMeasurementPoints.id });
    
    res.status(201).json({
      success: true,
      pointsAdded: insertedPoints.length,
      message: 'Measurement points added successfully'
    });
  } catch (error) {
    console.error('Error adding measurement points:', error);
    res.status(500).json({ 
      error: 'Failed to add measurement points',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/mobile/measurements - Get list of measurements
router.get('/measurements', async (req: Request, res: Response) => {
  try {
    const secureMode = req.query.secure === 'true';
    
    // If in secure mode, check authentication
    if (secureMode && !req.isAuthenticated()) {
      return res.status(401).json({ 
        error: 'Authentication required for secure data access',
        message: 'Please log in to access secure measurements'
      });
    }
    
    // Get measurements with authentication check for secure mode
    // Use different queries based on authentication status to avoid type errors
    const measurements = secureMode && !req.isAuthenticated() 
      ? await db.select({
          id: mobileMeasurements.id,
          deviceId: mobileMeasurements.deviceId,
          sessionId: mobileMeasurements.sessionId,
          timestamp: mobileMeasurements.timestamp,
          startTime: mobileMeasurements.startTime,
          duration: mobileMeasurements.duration,
          peakVibration: mobileMeasurements.peakVibration,
          averageVibration: mobileMeasurements.averageVibration,
          unitId: mobileMeasurements.unitId,
          // Exclude metadata for unauthenticated requests in secure mode
        }).from(mobileMeasurements)
      : await db.select({
          id: mobileMeasurements.id,
          deviceId: mobileMeasurements.deviceId,
          sessionId: mobileMeasurements.sessionId,
          timestamp: mobileMeasurements.timestamp,
          startTime: mobileMeasurements.startTime,
          duration: mobileMeasurements.duration,
          peakVibration: mobileMeasurements.peakVibration,
          averageVibration: mobileMeasurements.averageVibration,
          unitId: mobileMeasurements.unitId,
          metadata: mobileMeasurements.metadata
    })
    .from(mobileMeasurements)
    .orderBy(desc(mobileMeasurements.timestamp))
    .limit(50);
    
    // Add no-cache headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.json(measurements);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    res.status(500).json({ error: 'Failed to fetch measurements' });
  }
});

// GET /api/mobile/measurements/:id - Get a specific measurement with its data points
router.get('/measurements/:id', async (req: Request, res: Response) => {
  try {
    const measurementId = parseInt(req.params.id);
    
    if (isNaN(measurementId)) {
      return res.status(400).json({ error: 'Invalid measurement ID' });
    }
    
    const [measurement] = await db.select().from(mobileMeasurements)
      .where(eq(mobileMeasurements.id, measurementId));
    
    if (!measurement) {
      return res.status(404).json({ error: 'Measurement not found' });
    }
    
    const points = await db.select().from(mobileMeasurementPoints)
      .where(eq(mobileMeasurementPoints.measurementId, measurementId))
      .orderBy(mobileMeasurementPoints.timestamp);
    
    // Add no-cache headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.json({
      ...measurement,
      points
    });
  } catch (error) {
    console.error('Error fetching measurement details:', error);
    res.status(500).json({ error: 'Failed to fetch measurement details' });
  }
});

// Serve the mobile app static files
router.get('/', (req: Request, res: Response) => {
  res.redirect('/mobile/index.html');
});

// GET /api/mobile/tvi/:measurementId - Get TVI analysis for a measurement
router.get('/tvi/:measurementId', async (req: Request, res: Response) => {
  try {
    const measurementId = parseInt(req.params.measurementId);
    
    if (isNaN(measurementId)) {
      return res.status(400).json({ error: 'Invalid measurement ID' });
    }
    
    const tviRecord = await db.query.transportVibrationIndex.findFirst({
      where: eq(transportVibrationIndex.measurementId, measurementId),
      with: {
        measurement: true,
        unit: true
      }
    });
    
    if (!tviRecord) {
      return res.status(404).json({ error: 'TVI analysis not found for this measurement' });
    }
    
    // Parse recommendations back from JSON
    const recommendations = tviRecord.recommendedActions 
      ? JSON.parse(tviRecord.recommendedActions) 
      : [];
    
    res.json({
      ...tviRecord,
      recommendedActions: recommendations
    });
  } catch (error) {
    console.error('Error fetching TVI analysis:', error);
    res.status(500).json({ 
      error: 'Failed to fetch TVI analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/mobile/calculate-tvi/:measurementId - Calculate TVI for existing measurement
router.post('/calculate-tvi/:measurementId', async (req: Request, res: Response) => {
  try {
    const measurementId = parseInt(req.params.measurementId);
    
    if (isNaN(measurementId)) {
      return res.status(400).json({ error: 'Invalid measurement ID' });
    }
    
    // Check if measurement exists
    const measurement = await db.query.mobileMeasurements.findFirst({
      where: eq(mobileMeasurements.id, measurementId)
    });
    
    if (!measurement) {
      return res.status(404).json({ error: 'Measurement not found' });
    }
    
    // Calculate TVI
    const tviAnalysis = await tviCalculator.calculateTVI(measurementId);
    const tviId = await tviCalculator.saveTVIAnalysis(measurementId, tviAnalysis, measurement.unitId);
    
    res.json({
      success: true,
      tviId,
      analysis: tviAnalysis,
      message: 'TVI calculated successfully'
    });
  } catch (error) {
    console.error('Error calculating TVI:', error);
    res.status(500).json({ 
      error: 'Failed to calculate TVI',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/mobile/tvi/unit/:unitId - Get TVI history for a unit
router.get('/tvi/unit/:unitId', async (req: Request, res: Response) => {
  try {
    const unitId = parseInt(req.params.unitId);
    const limit = parseInt(req.query.limit as string) || 50;
    
    if (isNaN(unitId)) {
      return res.status(400).json({ error: 'Invalid unit ID' });
    }
    
    const tviHistory = await db.query.transportVibrationIndex.findMany({
      where: eq(transportVibrationIndex.unitId, unitId),
      orderBy: desc(transportVibrationIndex.calculatedAt),
      limit,
      with: {
        measurement: true
      }
    });
    
    // Parse recommendations for each record
    const enrichedHistory = tviHistory.map(record => ({
      ...record,
      recommendedActions: record.recommendedActions 
        ? JSON.parse(record.recommendedActions) 
        : []
    }));
    
    res.json(enrichedHistory);
  } catch (error) {
    console.error('Error fetching TVI history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch TVI history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/mobile/tvi/summary - Get TVI summary statistics
router.get('/tvi/summary', async (req: Request, res: Response) => {
  try {
    const unitId = req.query.unitId ? parseInt(req.query.unitId as string) : undefined;
    const days = parseInt(req.query.days as string) || 30;
    
    const whereClause = unitId 
      ? eq(transportVibrationIndex.unitId, unitId)
      : undefined;
    
    // Get recent TVI records
    const recentTVI = await db.query.transportVibrationIndex.findMany({
      where: whereClause,
      orderBy: desc(transportVibrationIndex.calculatedAt),
      limit: 100
    });
    
    if (recentTVI.length === 0) {
      return res.json({
        totalMeasurements: 0,
        averageTVIScore: 0,
        safetyDistribution: {},
        riskDistribution: {},
        trends: {
          improving: false,
          stable: true,
          declining: false
        }
      });
    }
    
    // Calculate summary statistics
    const totalMeasurements = recentTVI.length;
    const averageTVIScore = recentTVI.reduce((sum, tvi) => sum + tvi.tviScore, 0) / totalMeasurements;
    
    // Safety rating distribution
    const safetyDistribution = recentTVI.reduce((acc: any, tvi) => {
      acc[tvi.safetyRating] = (acc[tvi.safetyRating] || 0) + 1;
      return acc;
    }, {});
    
    // Risk level distribution
    const riskDistribution = recentTVI.reduce((acc: any, tvi) => {
      acc[tvi.riskLevel] = (acc[tvi.riskLevel] || 0) + 1;
      return acc;
    }, {});
    
    // Trend analysis (last 10 vs previous 10)
    const recent10 = recentTVI.slice(0, 10);
    const previous10 = recentTVI.slice(10, 20);
    
    let trends = {
      improving: false,
      stable: true,
      declining: false
    };
    
    if (recent10.length >= 5 && previous10.length >= 5) {
      const recentAvg = recent10.reduce((sum, tvi) => sum + tvi.tviScore, 0) / recent10.length;
      const previousAvg = previous10.reduce((sum, tvi) => sum + tvi.tviScore, 0) / previous10.length;
      const change = recentAvg - previousAvg;
      
      if (change > 2) {
        trends = { improving: true, stable: false, declining: false };
      } else if (change < -2) {
        trends = { improving: false, stable: false, declining: true };
      }
    }
    
    res.json({
      totalMeasurements,
      averageTVIScore: Math.round(averageTVIScore * 100) / 100,
      safetyDistribution,
      riskDistribution,
      trends,
      timeRange: `${days} days`
    });
  } catch (error) {
    console.error('Error generating TVI summary:', error);
    res.status(500).json({ 
      error: 'Failed to generate TVI summary',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;