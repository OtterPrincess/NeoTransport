import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Icon } from '@/components/ui/icon';
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
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

type AccelerometerData = {
  type: string;
  x: number;
  y: number;
  z: number;
  total: number;
  timestamp: string;
};

type DataPoint = {
  time: number;
  x: number;
  y: number;
  z: number;
  total: number;
};

const CHART_WINDOW_SIZE = 100; // Number of data points to display
const DATA_SAMPLE_RATE = 200; // How often to sample data points for the chart (ms)

export default function RealTimeAccelerometer() {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [xValue, setXValue] = useState(0);
  const [yValue, setYValue] = useState(0);
  const [zValue, setZValue] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [maxTotal, setMaxTotal] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  
  const socketRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number>(0);
  const dataBufferRef = useRef<DataPoint[]>([]);
  const { toast } = useToast();
  
  // Generate a unique session ID when recording starts
  const generateSessionId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  };
  
  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      prevTimeRef.current = 0;
      socket.send(JSON.stringify({ command: 'start_accelerometer' }));
      setChartData([]); // Clear existing chart data
      
      toast({
        title: "Connected",
        description: "Real-time accelerometer connection established",
        variant: "default",
      });
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'accelerometer') {
          // Update current values
          setXValue(data.x);
          setYValue(data.y);
          setZValue(data.z);
          setTotalValue(data.total);
          
          // Update max value if needed
          if (data.total > maxTotal) {
            setMaxTotal(data.total);
          }
          
          // Create a data point
          const now = Date.now();
          // For chart display - if recording use elapsed time, otherwise use a sequential counter
          const timeValue = isRecording && startTime
            ? (now - startTime) / 1000
            : prevTimeRef.current;
          
          prevTimeRef.current += 0.2; // Increment by 0.2 seconds for a smooth timeline when not recording
          
          const newPoint: DataPoint = {
            time: parseFloat(timeValue.toFixed(1)),
            x: Math.abs(data.x),
            y: Math.abs(data.y),
            z: Math.abs(data.z),
            total: data.total
          };
            
          // Always update the chart for real-time visualization
          setChartData(prevData => {
            const newData = [...prevData, newPoint];
            return newData.length > CHART_WINDOW_SIZE 
              ? newData.slice(-CHART_WINDOW_SIZE) 
              : newData;
          });
          
          // If recording, also store in the data buffer for saving to database
          if (isRecording) {
            dataBufferRef.current.push(newPoint);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to accelerometer",
        variant: "destructive",
      });
    };
    
    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };
    
    socketRef.current = socket;
  };
  
  // Auto-connect when component mounts
  useEffect(() => {
    // Connect to WebSocket when component mounts after a short delay
    const timeout = setTimeout(() => {
      connectWebSocket();
    }, 1000);
    
    // Cleanup when the component unmounts
    return () => {
      clearTimeout(timeout);
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ command: 'stop_accelerometer' }));
        socketRef.current.close();
      }
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const disconnectWebSocket = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ command: 'stop_accelerometer' }));
      socketRef.current.close();
    }
    setIsConnected(false);
    toast({
      title: "Disconnected",
      description: "Accelerometer connection closed",
      variant: "default",
    });
  };
  
  const toggleConnection = () => {
    if (isConnected) {
      disconnectWebSocket();
    } else {
      connectWebSocket();
    }
  };
  
  const startRecording = () => {
    setIsRecording(true);
    const currentTime = Date.now();
    setStartTime(currentTime);
    setChartData([]);
    setMaxTotal(0);
    dataBufferRef.current = []; // Clear the data buffer
    
    // Generate a new session ID for this recording
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    
    // Start timer for elapsed time
    timerRef.current = window.setInterval(() => {
      if (startTime) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);
    
    toast({
      title: "Recording Started",
      description: "Now capturing accelerometer data",
      variant: "default",
    });
  };
  
  const saveRecordingToDatabase = async (data: DataPoint[], sid: string) => {
    try {
      // Create a measurement record
      const measurementData = {
        sessionId: sid,
        deviceType: "Simulator",
        deviceId: "WEB-APP-" + navigator.userAgent.substring(0, 20),
        startTime: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration: elapsedTime,
        maxValue: maxTotal,
        description: "Web app accelerometer recording",
        dataPoints: data.length
      };
      
      // Save the measurement
      const response = await apiRequest("POST", "/api/mobile/measurements", measurementData);
      const savedMeasurement = await response.json();
      
      // Save each data point with the measurement ID
      if (savedMeasurement && savedMeasurement.id) {
        const batchSize = 50; // Save in batches to prevent too large requests
        
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize).map(point => ({
            measurementId: savedMeasurement.id,
            timestamp: new Date(startTime ? startTime + (point.time * 1000) : Date.now()).toISOString(),
            xAxis: point.x,
            yAxis: point.y,
            zAxis: point.z,
            totalValue: point.total
          }));
          
          await apiRequest("POST", "/api/mobile/measurement-points", { points: batch });
        }
        
        // Invalidate the measurements query to refresh the data
        queryClient.invalidateQueries({ queryKey: ['/api/mobile/measurements'] });
      }
      
      return savedMeasurement.id;
    } catch (error) {
      console.error('Error saving data to database:', error);
      throw error;
    }
  };
  
  const stopRecording = async () => {
    // Stop the timer immediately
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Get the final data from our buffer
    const finalData = [...dataBufferRef.current];
    const finalSessionId = sessionId;
    
    // Reset the state
    setIsRecording(false);
    dataBufferRef.current = [];
    
    // Save to database
    try {
      // Show toast message while saving
      toast({
        title: "Saving Data",
        description: `Saving ${finalData.length} data points to database...`,
        variant: "default",
      });
      
      const measurementId = await saveRecordingToDatabase(finalData, finalSessionId);
      
      toast({
        title: "Recording Saved",
        description: `Recording saved with ID: ${measurementId}`,
        variant: "default",
      });
      
      console.log('Recording saved. Measurement ID:', measurementId);
    } catch (error) {
      toast({
        title: "Error Saving Data",
        description: "Failed to save recording data",
        variant: "destructive",
      });
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Gauge color based on vibration intensity
  const getGaugeColor = (value: number) => {
    if (value < 0.05) return '#4CAF50'; // Green
    if (value < 0.1) return '#FFC107';  // Yellow
    if (value < 0.2) return '#FF9800';  // Orange
    return '#F44336';                    // Red
  };
  
  // Calculate gauge percentage (0-100)
  const getGaugePercentage = (value: number) => {
    // Max expected value is 0.5
    return Math.min(Math.max(value * 200, 0), 100);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Real-Time Accelerometer</CardTitle>
          <CardDescription>
            Monitor live shock and vibration data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connection Status:</span>
              <span className={`text-sm font-medium ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <Button
              onClick={toggleConnection}
              className={isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-[#4A148C] hover:bg-[#6A1B9A]'}
            >
              {isConnected ? (
                <>
                  <Icon name="stop" size={16} className="mr-2" />
                  Disconnect
                </>
              ) : (
                <>
                  <Icon name="play" size={16} className="mr-2" />
                  Connect
                </>
              )}
            </Button>
            
            <Separator className="my-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Recording:</span>
              <span className={`text-sm font-medium ${isRecording ? 'text-green-500' : 'text-muted-foreground'}`}>
                {isRecording ? `Recording (${formatTime(elapsedTime)})` : 'Not Recording'}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={startRecording}
                disabled={!isConnected || isRecording}
                className="bg-green-600 hover:bg-green-700 flex-1"
              >
                <Icon name="record" size={16} className="mr-2" />
                Start
              </Button>
              <Button
                onClick={stopRecording}
                disabled={!isRecording}
                className="bg-red-500 hover:bg-red-600 flex-1"
              >
                <Icon name="stop" size={16} className="mr-2" />
                Stop
              </Button>
            </div>
            
            <Separator className="my-2" />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">X-axis:</span>
                  <span className="text-sm">{xValue.toFixed(3)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-200 ease-in-out"
                    style={{ width: `${getGaugePercentage(Math.abs(xValue))}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Y-axis:</span>
                  <span className="text-sm">{yValue.toFixed(3)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-200 ease-in-out"
                    style={{ width: `${getGaugePercentage(Math.abs(yValue))}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Z-axis:</span>
                  <span className="text-sm">{zValue.toFixed(3)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-200 ease-in-out"
                    style={{ width: `${getGaugePercentage(Math.abs(zValue))}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Vibration:</span>
                  <span className="text-sm">{totalValue.toFixed(3)}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-200 ease-in-out"
                    style={{ 
                      width: `${getGaugePercentage(totalValue)}%`,
                      backgroundColor: getGaugeColor(totalValue)
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium">Max Vibration:</span>
                <span className="text-sm font-medium" style={{ color: getGaugeColor(maxTotal) }}>
                  {maxTotal.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Vibration Waveform</CardTitle>
          <CardDescription>
            Real-time vibration data visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Time (seconds)', position: 'insideBottomRight', offset: -10 }} 
                  />
                  <YAxis 
                    label={{ value: 'Vibration (g)', angle: -90, position: 'insideLeft' }} 
                    domain={[0, 'auto']}
                  />
                  <Tooltip 
                    formatter={(value) => [(value as number).toFixed(3), 'g']}
                    labelFormatter={(label) => `Time: ${label}s`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#9C27B0" 
                    strokeWidth={2.5} 
                    dot={false} 
                    isAnimationActive
                    animationDuration={300}
                    name="Total Vibration" 
                    className="animate-pulse"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="x" 
                    stroke="#2196F3" 
                    strokeWidth={1.5} 
                    dot={false} 
                    isAnimationActive
                    animationDuration={300}
                    name="X-axis" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke="#4CAF50" 
                    strokeWidth={1.5} 
                    dot={false} 
                    isAnimationActive
                    animationDuration={300}
                    name="Y-axis" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="z" 
                    stroke="#FF9800" 
                    strokeWidth={1.5} 
                    dot={false} 
                    isAnimationActive
                    animationDuration={300}
                    name="Z-axis" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-gray-200 rounded-lg">
              <Icon name="waveform" size={64} className="text-gray-300 mb-4" />
              <p className="text-muted-foreground">Connect to the accelerometer to see real-time data</p>
              <Button 
                onClick={toggleConnection}
                className="mt-4 bg-[#4A148C] hover:bg-[#6A1B9A]"
              >
                <Icon name="play" size={16} className="mr-2" />
                Connect
              </Button>
            </div>
          )}
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">About this visualization</h3>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Secure Database Storage
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              This display shows real-time accelerometer data. The vibration is measured 
              in g-forces (1g = 9.8 m/s²). All data is securely stored in your database
              when recording is active. Start recording to capture measurements.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}