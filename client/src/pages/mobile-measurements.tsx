import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from 'date-fns';
import { queryClient } from '@/lib/queryClient';
import { Icon } from '@/components/ui/icon';
import RealTimeAccelerometer from '@/components/mobile/real-time-accelerometer';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mobile measurement types
type MobileMeasurement = {
  id: number;
  sessionId: string;
  deviceId: string;
  timestamp: string;
  startTime: string;
  duration: number;
  peakVibration: number;
  averageVibration: number;
  unitId: number | null;
  metadata: any;
};

type MeasurementPoint = {
  id: number;
  measurementId: number;
  timestamp: string;
  x: number;
  y: number;
  z: number;
  total: number;
};

type MeasurementWithPoints = MobileMeasurement & {
  points: MeasurementPoint[];
};

export default function MobileMeasurements() {
  const [selectedMeasurement, setSelectedMeasurement] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [, setLocation] = useLocation();
  
  // Fetch all measurements
  const { data: measurements, isLoading, error } = useQuery<MobileMeasurement[]>({
    queryKey: ['/api/mobile/measurements'],
    staleTime: 30000,
  });

  // Fetch selected measurement details
  const { data: measurementDetail, isLoading: isDetailLoading } = useQuery<MeasurementWithPoints>({
    queryKey: ['/api/mobile/measurements', selectedMeasurement],
    enabled: !!selectedMeasurement,
    staleTime: 30000,
  });
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };
  
  const handleViewDetails = (id: number) => {
    setSelectedMeasurement(id);
    setDialogOpen(true);
  };
  
  const formatChartData = (points: MeasurementPoint[]) => {
    if (!points || !points.length) return [];
    
    // Get the start time to normalize timestamps
    const startTime = new Date(points[0].timestamp).getTime();
    
    return points.map(point => {
      const time = (new Date(point.timestamp).getTime() - startTime) / 1000; // seconds from start
      return {
        time: Number(time.toFixed(1)),
        x: Math.abs(point.x),
        y: Math.abs(point.y),
        z: Math.abs(point.z),
        total: point.total
      };
    });
  };
  
  const generateQrCode = () => {
    window.open('/mobile/qr.html', '_blank');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          className="mr-2 text-[#662C6C]" 
          onClick={() => setLocation('/')}
        >
          <Icon name="back" size={16} className="mr-1" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-[#4A148C] font-libre">Mobile Shock Measurements</h1>
            <span className="ml-3 text-xs bg-[#E1BEE7] text-[#4A148C] px-2 py-1 rounded-md font-medium">
              Accelerometer App v2.1.0
            </span>
          </div>
          <p className="text-muted-foreground">
            View and analyze shock measurements collected from mobile devices
          </p>
        </div>
        <Button 
          onClick={generateQrCode}
          className="bg-[#4A148C] hover:bg-[#6A1B9A]"
        >
          <Icon name="mobile" size={16} className="mr-2" />
          Generate QR Code
        </Button>
      </div>
      
      <Tabs defaultValue="realtime" className="w-full">
        <TabsList>
          <TabsTrigger value="realtime">Real-Time Accelerometer</TabsTrigger>
          <TabsTrigger value="all">All Measurements</TabsTrigger>
          <TabsTrigger value="recent">Recent (24h)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="realtime" className="mt-4">
          <RealTimeAccelerometer />
        </TabsContent>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Mobile Measurements</CardTitle>
              <CardDescription>
                Complete history of shock measurements taken with mobile devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-[#9C27B0] border-t-transparent rounded-full"></div>
                </div>
              ) : error ? (
                <div className="py-8 text-center text-red-500">
                  Error loading measurements
                </div>
              ) : measurements && measurements.length > 0 ? (
                <Table>
                  <TableCaption>List of all mobile shock measurements</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Device ID</TableHead>
                      <TableHead>Peak Vibration</TableHead>
                      <TableHead>Avg Vibration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {measurements.map((measurement) => (
                      <TableRow key={measurement.id}>
                        <TableCell>{formatTimestamp(measurement.timestamp)}</TableCell>
                        <TableCell>{formatDuration(measurement.duration)}</TableCell>
                        <TableCell>{measurement.deviceId}</TableCell>
                        <TableCell>{measurement.peakVibration.toFixed(2)}</TableCell>
                        <TableCell>{measurement.averageVibration.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(measurement.id)}
                          >
                            <Icon name="info" size={16} className="mr-1" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No measurements recorded yet.</p>
                  <Button className="mt-4 bg-[#4A148C] hover:bg-[#6A1B9A]" onClick={generateQrCode}>
                    Generate QR Code to Collect Data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Measurements (Last 24 Hours)</CardTitle>
              <CardDescription>
                Shock measurements taken in the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-[#9C27B0] border-t-transparent rounded-full"></div>
                </div>
              ) : measurements && measurements.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Peak Vibration</TableHead>
                      <TableHead>Avg Vibration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {measurements
                      .filter(m => {
                        const measurementDate = new Date(m.timestamp);
                        const oneDayAgo = new Date();
                        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
                        return measurementDate >= oneDayAgo;
                      })
                      .map((measurement) => (
                        <TableRow key={measurement.id}>
                          <TableCell>{format(new Date(measurement.timestamp), 'h:mm a')}</TableCell>
                          <TableCell>{formatDuration(measurement.duration)}</TableCell>
                          <TableCell>{measurement.peakVibration.toFixed(2)}</TableCell>
                          <TableCell>{measurement.averageVibration.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(measurement.id)}
                            >
                              <Icon name="info" size={16} className="mr-1" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No measurements recorded in the last 24 hours.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Measurement details dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Measurement Details</DialogTitle>
            <DialogDescription>
              Detailed view of the shock measurement data
            </DialogDescription>
          </DialogHeader>
          
          {isDetailLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-[#9C27B0] border-t-transparent rounded-full"></div>
            </div>
          ) : measurementDetail ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Session ID</h3>
                  <p>{measurementDetail.sessionId}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Device ID</h3>
                  <p>{measurementDetail.deviceId}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Date & Time</h3>
                  <p>{formatTimestamp(measurementDetail.startTime)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Duration</h3>
                  <p>{formatDuration(measurementDetail.duration)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Peak Vibration</h3>
                  <p>{measurementDetail.peakVibration.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Average Vibration</h3>
                  <p>{measurementDetail.averageVibration.toFixed(2)}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="font-medium mb-2">Vibration Over Time</h3>
              
              {measurementDetail.points && measurementDetail.points.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={formatChartData(measurementDetail.points)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis 
                        dataKey="time" 
                        label={{ value: 'Time (seconds)', position: 'insideBottomRight', offset: -10 }} 
                      />
                      <YAxis label={{ value: 'Vibration', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value) => [(value as number).toFixed(2), 'Vibration']}
                        labelFormatter={(label) => `Time: ${label}s`}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="total" stroke="#9C27B0" strokeWidth={2} dot={false} name="Total Vibration" />
                      <Line type="monotone" dataKey="x" stroke="#2196F3" strokeWidth={1} dot={false} name="X-axis" />
                      <Line type="monotone" dataKey="y" stroke="#4CAF50" strokeWidth={1} dot={false} name="Y-axis" />
                      <Line type="monotone" dataKey="z" stroke="#FF9800" strokeWidth={1} dot={false} name="Z-axis" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No detailed measurement points available</p>
              )}
              
              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Measurement data not found</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}