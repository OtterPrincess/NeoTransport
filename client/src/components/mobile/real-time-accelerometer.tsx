import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface AccelerometerData {
  time: number;
  x: number;
  y: number;
  z: number;
  total: number;
}

const RealTimeAccelerometer: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accelerometerData, setAccelerometerData] = useState<AccelerometerData[]>([]);
  const [currentValues, setCurrentValues] = useState<{x: number, y: number, z: number, total: number}>({
    x: 0,
    y: 0,
    z: 0,
    total: 0
  });
  const [isRunning, setIsRunning] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const chartDataRef = useRef<AccelerometerData[]>([]);
  const startTimeRef = useRef<number>(0);

  // Initialize WebSocket connection
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      // Try to reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'accelerometer') {
          updateAccelerometerData(data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  };

  const updateAccelerometerData = (data: {x: number, y: number, z: number, total: number}) => {
    if (!isRunning) return;

    const now = Date.now();
    if (startTimeRef.current === 0) {
      startTimeRef.current = now;
    }

    const time = (now - startTimeRef.current) / 1000; // seconds

    // Update current values
    setCurrentValues(data);

    // Update chart data
    const newPoint = {
      time: parseFloat(time.toFixed(2)),
      x: parseFloat(data.x.toFixed(3)),
      y: parseFloat(data.y.toFixed(3)),
      z: parseFloat(data.z.toFixed(3)),
      total: parseFloat(data.total.toFixed(3))
    };

    chartDataRef.current = [...chartDataRef.current, newPoint];
    
    // Keep only the last 20 seconds of data (assuming 10 measurements per second)
    if (chartDataRef.current.length > 200) {
      chartDataRef.current = chartDataRef.current.slice(-200);
    }

    setAccelerometerData([...chartDataRef.current]);
  };

  const toggleMeasurement = () => {
    if (isRunning) {
      stopMeasurement();
    } else {
      startMeasurement();
    }
  };

  const startMeasurement = () => {
    if (!isConnected) {
      return;
    }
    
    // Clear previous data
    chartDataRef.current = [];
    setAccelerometerData([]);
    startTimeRef.current = 0;
    
    // Start new measurement
    setIsRunning(true);
    
    // Send start command to server
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ command: 'start_accelerometer' }));
    }
  };

  const stopMeasurement = () => {
    setIsRunning(false);
    
    // Send stop command to server
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ command: 'stop_accelerometer' }));
    }
  };

  const resetMeasurement = () => {
    // Clear all data
    chartDataRef.current = [];
    setAccelerometerData([]);
    startTimeRef.current = 0;
    setCurrentValues({ x: 0, y: 0, z: 0, total: 0 });
  };

  // Mock data for display purposes when not connected
  useEffect(() => {
    if (!isConnected) {
      const mockDataInterval = setInterval(() => {
        const mockX = (Math.random() * 0.2 - 0.1).toFixed(3);
        const mockY = (Math.random() * 0.2 - 0.1).toFixed(3);
        const mockZ = (Math.random() * 0.3 - 0.2).toFixed(3);
        const mockTotal = Math.sqrt(
          Math.pow(parseFloat(mockX), 2) + 
          Math.pow(parseFloat(mockY), 2) + 
          Math.pow(parseFloat(mockZ), 2)
        ).toFixed(3);
        
        updateAccelerometerData({
          x: parseFloat(mockX),
          y: parseFloat(mockY),
          z: parseFloat(mockZ),
          total: parseFloat(mockTotal)
        });
      }, 100);
      
      return () => clearInterval(mockDataInterval);
    }
  }, [isConnected, isRunning]);

  return (
    <Card className="w-full">
      <CardHeader className="bg-[#4CAF50] text-white">
        <div className="flex justify-between items-center">
          <CardTitle>Real-Time Accelerometer</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-500'}`}></div>
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 bg-[#263238] text-white">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-5 text-base">
              <span className="text-red-400">x: {currentValues.x.toFixed(3)}</span>
              <span className="text-green-400">y: {currentValues.y.toFixed(3)}</span>
              <span className="text-blue-400">z: {currentValues.z.toFixed(3)}</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={toggleMeasurement}
                className="p-2 rounded-full bg-opacity-20 bg-white hover:bg-opacity-30 transition-colors"
              >
                {isRunning ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>
              <button 
                onClick={resetMeasurement}
                className="p-2 rounded-full bg-opacity-20 bg-white hover:bg-opacity-30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="text-center mb-2">
            <span className="text-white">Total acceleration = {currentValues.total.toFixed(3)}</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={accelerometerData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5, fill: '#ffffff' }}
                  stroke="#ffffff"
                />
                <YAxis 
                  label={{ value: 'Acceleration (m/s²)', angle: -90, position: 'insideLeft', offset: 10, fill: '#ffffff' }}
                  stroke="#ffffff" 
                  domain={[-15, 15]}
                />
                <Tooltip 
                  formatter={(value) => [(value as number).toFixed(3), 'Acceleration']}
                  labelFormatter={(label) => `Time: ${label}s`}
                  contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Legend wrapperStyle={{ color: '#ffffff' }} />
                <Line type="monotone" dataKey="x" stroke="#F44336" dot={false} name="X-axis" />
                <Line type="monotone" dataKey="y" stroke="#4CAF50" dot={false} name="Y-axis" />
                <Line type="monotone" dataKey="z" stroke="#2196F3" dot={false} name="Z-axis" />
                <Line type="monotone" dataKey="total" stroke="#E0E0E0" dot={false} name="Total" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium mb-2">Connection Status</h3>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{isConnected ? 'Connected to server' : 'Not connected'}</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium mb-2">Accelerometer Info</h3>
              <p className="text-sm">Data provider: MonoDAQ-1xACC</p>
              <p className="text-sm">Sampling rate: 10 Hz</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            This panel displays real-time accelerometer data from the MonoDAQ-1xACC device. 
            The chart shows acceleration values along the X, Y, and Z axes over time, with the total 
            acceleration calculated as the vector magnitude.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeAccelerometer;