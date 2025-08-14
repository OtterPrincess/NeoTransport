import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/dashboard/header";
import TabNavigation from "@/components/dashboard/tab-navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Activity } from "lucide-react";

interface TVISummary {
  totalMeasurements: number;
  averageTVIScore: number;
  safetyDistribution: Record<string, number>;
  riskDistribution: Record<string, number>;
  trends: {
    improving: boolean;
    stable: boolean;
    declining: boolean;
  };
}

interface TVIRecord {
  id: number;
  measurementId: number;
  unitId?: number;
  timestamp: string;
  tviScore: number;
  safetyRating: string;
  riskLevel: string;
  peakVibrationScore: number;
  sustainedVibrationScore: number;
  frequencyPatternScore: number;
  recommendedActions: string[];
  percentileRank?: number;
  baselineComparison?: number;
  measurement: {
    duration: number;
    peakVibration: number;
    averageVibration: number;
  };
}

const SAFETY_COLORS = {
  excellent: "#22c55e",
  good: "#84cc16",
  fair: "#eab308",
  poor: "#f97316",
  critical: "#ef4444"
};

const RISK_COLORS = {
  low: "#22c55e",
  moderate: "#eab308",
  high: "#f97316",
  critical: "#ef4444"
};

export default function TVIDashboard() {
  const [selectedUnit, setSelectedUnit] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("30");

  const { data: summary, isLoading: summaryLoading } = useQuery<TVISummary>({
    queryKey: ['/api/mobile/tvi/summary', selectedUnit, timeRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedUnit !== "all") params.append("unitId", selectedUnit);
      params.append("days", timeRange);
      
      const response = await fetch(`/api/mobile/tvi/summary?${params}`);
      if (!response.ok) throw new Error('Failed to fetch TVI summary');
      return response.json();
    }
  });

  const { data: units } = useQuery({
    queryKey: ['/api/units'],
  });

  const { data: tviHistory, isLoading: historyLoading } = useQuery<TVIRecord[]>({
    queryKey: ['/api/mobile/tvi/unit', selectedUnit],
    queryFn: async () => {
      if (selectedUnit === "all") {
        const response = await fetch('/api/mobile/measurements?limit=50');
        if (!response.ok) throw new Error('Failed to fetch measurements');
        const measurements = await response.json();
        
        // Get TVI data for each measurement that has it
        const tviPromises = measurements.map(async (m: any) => {
          try {
            const tviResponse = await fetch(`/api/mobile/tvi/${m.id}`);
            if (tviResponse.ok) {
              return await tviResponse.json();
            }
          } catch (e) {
            return null;
          }
        });
        
        const tviResults = await Promise.all(tviPromises);
        return tviResults.filter(Boolean);
      } else {
        const response = await fetch(`/api/mobile/tvi/unit/${selectedUnit}?limit=50`);
        if (!response.ok) throw new Error('Failed to fetch TVI history');
        return response.json();
      }
    },
    enabled: !!selectedUnit
  });

  const formatScore = (score: number) => Math.round(score * 10) / 10;

  const getSafetyBadgeVariant = (rating: string) => {
    switch (rating) {
      case "excellent": return "default";
      case "good": return "secondary";
      case "fair": return "outline";
      case "poor": return "destructive";
      case "critical": return "destructive";
      default: return "outline";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "moderate": return <Activity className="w-4 h-4 text-yellow-600" />;
      case "high": return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "critical": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendIcon = () => {
    if (summary?.trends.improving) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (summary?.trends.declining) return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  const chartData = tviHistory?.slice(0, 20).reverse().map((record, index) => ({
    index: index + 1,
    score: record.tviScore,
    safety: record.safetyRating,
    timestamp: new Date(record.timestamp).toLocaleDateString()
  })) || [];

  const safetyChartData = Object.entries(summary?.safetyDistribution || {}).map(([rating, count]) => ({
    rating,
    count,
    color: SAFETY_COLORS[rating as keyof typeof SAFETY_COLORS] || "#666"
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />
      <TabNavigation />

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-grow">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Transport Vibration Index
          </h1>
          <p className="text-slate-600">Advanced vibration analysis and safety assessment for neonatal transport</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Units</SelectItem>
              {units?.map((unit: any) => (
                <SelectItem key={unit.id} value={unit.id.toString()}>
                  {unit.unitId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Measurements</p>
                  <p className="text-2xl font-bold text-slate-900">{summary?.totalMeasurements || 0}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Average TVI Score</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {summary ? formatScore(summary.averageTVIScore) : 0}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  (summary?.averageTVIScore || 0) >= 70 ? 'bg-green-100' : 
                  (summary?.averageTVIScore || 0) >= 50 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  {getRiskIcon((summary?.averageTVIScore || 0) >= 70 ? 'low' : 
                    (summary?.averageTVIScore || 0) >= 50 ? 'moderate' : 'high')}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Safety Trend</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {summary?.trends.improving ? 'Improving' : 
                     summary?.trends.declining ? 'Declining' : 'Stable'}
                  </p>
                </div>
                {getTrendIcon()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">High Risk Events</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {(summary?.riskDistribution.high || 0) + (summary?.riskDistribution.critical || 0)}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* TVI Score Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">TVI Score Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      `${formatScore(value)}`, 
                      'TVI Score'
                    ]}
                    labelFormatter={(label: any) => `Measurement #${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Safety Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Safety Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={safetyChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="count"
                    label={({ rating, count }) => `${rating}: ${count}`}
                  >
                    {safetyChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent TVI Analyses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent TVI Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : tviHistory && tviHistory.length > 0 ? (
              <div className="space-y-4">
                {tviHistory.slice(0, 10).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRiskIcon(record.riskLevel)}
                        <span className="font-medium">TVI Score: {formatScore(record.tviScore)}</span>
                      </div>
                      <Badge variant={getSafetyBadgeVariant(record.safetyRating)}>
                        {record.safetyRating}
                      </Badge>
                      <span className="text-sm text-slate-600">
                        {new Date(record.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-slate-600">
                        Peak: {formatScore(record.measurement.peakVibration)}g
                      </div>
                      <div className="text-sm text-slate-600">
                        Duration: {Math.round(record.measurement.duration / 60)}min
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-600">
                No TVI analyses found for the selected criteria
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}