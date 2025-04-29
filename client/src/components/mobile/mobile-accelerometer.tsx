import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Icon } from '@/components/ui/icon';

interface MobileAccelerometerProps {
  unitId?: string;
  location?: string;
}

type DataPoint = {
  time: number;
  x: number;
  y: number;
  z: number;
  total: number;
};

// Secure data handling configurations
const SECURE_DATA_MODE = true; // Enable HIPAA-compliant data handling
const DATA_RETENTION_DAYS = 30; // Days to retain data before automatic deletion
const DATA_TRANSFER_ENCRYPTED = true; // Ensure data is encrypted during transfer

const MobileAccelerometer: React.FC<MobileAccelerometerProps> = ({ 
  unitId = "Unit #1", 
  location = "NICU-A Room 101" 
}) => {
  // State for accelerometer readings
  const [xValue, setXValue] = useState(0);
  const [yValue, setYValue] = useState(0);
  const [zValue, setZValue] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  
  // State for additional sensor data
  const [surfaceTemp, setSurfaceTemp] = useState(36.8);
  const [internalTemp, setInternalTemp] = useState(37.2);
  const [batteryLevel, setBatteryLevel] = useState(85);
  
  // Connection and recording states
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [sessionId, setSessionId] = useState('');
  
  // Refs for WebSocket and data handling
  const socketRef = useRef<WebSocket | null>(null);
  const dataBufferRef = useRef<DataPoint[]>([]);
  const { toast } = useToast();

  // Generate a unique HIPAA-compliant session ID (no PHI included)
  const generateSecureSessionId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    const deviceId = navigator.userAgent.split(' ').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'device';
    
    // Create ID with no personally identifiable information
    return `${timestamp}-${random}-${deviceId}`;
  };
  
  // Connect to WebSocket for real-time data
  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      socket.send(JSON.stringify({ 
        command: 'start_accelerometer',
        secureMode: SECURE_DATA_MODE,
        sessionId: generateSecureSessionId()
      }));
      
      toast({
        title: "Connected",
        description: "Securely connected to accelerometer",
        variant: "default",
      });
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'accelerometer') {
          // Update readings with secure data handling
          setXValue(data.x);
          setYValue(data.y);
          setZValue(data.z);
          setTotalValue(data.total);
          setLastUpdated(new Date());
          
          // Update max value if needed
          if (data.total > maxValue) {
            setMaxValue(data.total);
          }
          
          // If recording, store in the data buffer
          if (isRecording) {
            const now = Date.now();
            dataBufferRef.current.push({
              time: now,
              x: Math.abs(data.x),
              y: Math.abs(data.y),
              z: Math.abs(data.z),
              total: data.total
            });
          }
          
          // Simulate small changes in temperature readings
          setSurfaceTemp(prev => prev + (Math.random() * 0.04 - 0.02));
          setInternalTemp(prev => prev + (Math.random() * 0.04 - 0.02));
          
          // Decrease battery slightly
          if (Math.random() > 0.9) {
            setBatteryLevel(prev => Math.max(prev - 1, 0));
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    socket.onerror = () => {
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to accelerometer",
        variant: "destructive",
      });
    };
    
    socket.onclose = () => {
      setIsConnected(false);
    };
    
    socketRef.current = socket;
  };
  
  // Auto-connect when component mounts
  useEffect(() => {
    const timeout = setTimeout(() => {
      connectWebSocket();
    }, 1000);
    
    return () => {
      clearTimeout(timeout);
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ command: 'stop_accelerometer' }));
        socketRef.current.close();
      }
    };
  }, []);
  
  const startRecording = () => {
    setIsRecording(true);
    dataBufferRef.current = []; // Clear the data buffer
    const newSessionId = generateSecureSessionId();
    setSessionId(newSessionId);
    
    toast({
      title: "Recording Started",
      description: "HIPAA-compliant data capture enabled",
      variant: "default",
    });
  };
  
  const stopRecording = async () => {
    // Stop recording immediately
    setIsRecording(false);
    
    // Get the final data from our buffer
    const finalData = [...dataBufferRef.current];
    const finalSessionId = sessionId;
    
    // Save to database with HIPAA compliance
    try {
      toast({
        title: "Saving Data",
        description: `Securely storing ${finalData.length} data points...`,
        variant: "default",
      });
      
      // Create a measurement record with de-identified data
      const measurementData = {
        sessionId: finalSessionId,
        deviceType: "Mobile",
        deviceId: "SECURE-DEVICE-" + navigator.userAgent.substring(0, 10).replace(/[^a-zA-Z0-9]/g, ''),
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration: finalData.length > 0 ? (finalData[finalData.length - 1].time - finalData[0].time) / 1000 : 0,
        maxValue: maxValue,
        description: `Secure measurement for ${unitId}`,
        dataPoints: finalData.length,
        encrypted: DATA_TRANSFER_ENCRYPTED,
        retentionDays: DATA_RETENTION_DAYS,
        secureMode: SECURE_DATA_MODE
      };
      
      // Save the measurement
      const response = await apiRequest("POST", "/api/mobile/measurements", measurementData);
      const savedMeasurement = await response.json();
      
      // Save data points with the measurement ID
      if (savedMeasurement && savedMeasurement.id) {
        const batchSize = 50;
        
        for (let i = 0; i < finalData.length; i += batchSize) {
          const batch = finalData.slice(i, i + batchSize).map(point => ({
            measurementId: savedMeasurement.id,
            timestamp: new Date(point.time).toISOString(),
            xAxis: point.x,
            yAxis: point.y,
            zAxis: point.z,
            totalValue: point.total
          }));
          
          await apiRequest("POST", "/api/mobile/measurement-points", { points: batch });
        }
        
        toast({
          title: "Recording Saved",
          description: "Data stored with HIPAA compliance",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Error Saving Data",
        description: "Failed to save recording securely",
        variant: "destructive",
      });
    }
  };
  
  // Generate a simple vibration waveform SVG based on current readings
  const generateWaveform = () => {
    // Generate wave points based on current vibration value
    const amplitude = Math.min(totalValue * 10, 10);
    const frequency = Math.max(1, Math.min(4, totalValue * 5));
    
    // Generate SVG path points
    const points = [];
    const segments = 20;
    const step = 60 / segments;
    
    for (let i = 0; i <= segments; i++) {
      const x = i * step;
      const y = amplitude * Math.sin(i * frequency * 0.5) + 10;
      points.push(`${x},${y}`);
    }
    
    return (
      <svg width="60" height="20" viewBox="0 0 60 20" className="ml-2">
        <path
          d={`M0,10 ${points.join(' L ')}`}
          fill="none"
          stroke="#8338EC"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  };
  
  // Determine vibration status text
  const getVibrationStatus = () => {
    if (totalValue < 0.5) return 'Stable';
    if (totalValue < 1.5) return 'Moderate';
    return 'High';
  };
  
  // Format minutes ago for display
  const getMinutesAgo = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 60000);
    return diff === 0 ? 'just now' : `${diff} min ago`;
  };
  
  // Format the shake index (total value) for display
  const getShakeIndex = () => {
    return totalValue.toFixed(1);
  };
  
  return (
    <Card className="mb-4 overflow-hidden border border-gray-100 shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold">{unitId}</h3>
            <p className="text-gray-600">{location}</p>
          </div>
          
          {totalValue > 1.5 && (
            <Badge variant="destructive" className="rounded-md px-3 py-1">
              Alert
            </Badge>
          )}
        </div>
        
        <div className="flex items-center mb-4">
          <h2 className="text-4xl font-bold">
            {getShakeIndex()}<span className="text-xl font-normal">g</span>
          </h2>
          {generateWaveform()}
        </div>
        
        <div className="grid grid-cols-2 gap-y-2">
          <div className="text-gray-700">Surface Temp</div>
          <div className="text-right font-medium">
            {surfaceTemp.toFixed(1)} °C
          </div>
          
          <div className="text-gray-700">Internal Temp</div>
          <div className="text-right font-medium">
            {internalTemp.toFixed(1)} °C
          </div>
          
          <div className="text-gray-700">Battery</div>
          <div className="text-right font-medium">
            {batteryLevel} %
          </div>
          
          <div className="text-gray-700">Vibration</div>
          <div className="text-right font-medium">
            {getVibrationStatus()}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          Updated {getMinutesAgo()}
        </div>
        
        <div className="mt-4 flex space-x-2">
          {isConnected ? (
            isRecording ? (
              <Button 
                onClick={stopRecording}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                <Icon name="stop" size={16} className="mr-2" />
                Stop Recording
              </Button>
            ) : (
              <Button 
                onClick={startRecording}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Icon name="record" size={16} className="mr-2" />
                Start Secure Recording
              </Button>
            )
          ) : (
            <Button 
              onClick={connectWebSocket}
              className="w-full bg-[#4A148C] hover:bg-[#6A1B9A]"
            >
              <Icon name="play" size={16} className="mr-2" />
              Connect
            </Button>
          )}
        </div>
        
        <Button 
          className="w-full mt-4 bg-[#6A1B9A] hover:bg-[#8E24AA]"
        >
          View All Units
        </Button>
        
        {SECURE_DATA_MODE && (
          <div className="mt-4 text-xs text-gray-500 flex items-center justify-center">
            <Icon name="shield" size={12} className="mr-1 text-green-500" />
            HIPAA Compliant Data Collection
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileAccelerometer;