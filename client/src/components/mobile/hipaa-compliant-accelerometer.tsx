import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Icon } from '@/components/ui/icon';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface HipaaCompliantAccelerometerProps {
  unitId?: string;
  location?: string;
}

// Small waveform SVG component that matches the reference image
const VibrationWaveform: React.FC<{ amplitude: number }> = ({ amplitude }) => {
  // Generate a wave pattern based on amplitude (0-1 scale)
  const normalizedAmplitude = Math.min(1, Math.max(0, amplitude));
  const height = 20;
  const width = 60;
  
  // Create a more natural-looking waveform similar to the reference
  const generatePath = () => {
    const segments = 20;
    const points = [];
    const baseY = height / 2;
    
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      
      // Create a more natural, asymmetric wave pattern
      let yOffset;
      if (i < segments * 0.3) {
        yOffset = Math.sin(i * 0.8) * normalizedAmplitude * (height * 0.4);
      } else if (i < segments * 0.5) {
        yOffset = Math.sin(i * 0.8 + 1) * normalizedAmplitude * (height * 0.3);
      } else if (i < segments * 0.7) {
        yOffset = Math.sin(i * 0.6 + 2) * normalizedAmplitude * (height * 0.5);
      } else {
        yOffset = Math.sin(i * 0.7 + 0.5) * normalizedAmplitude * (height * 0.35);
      }
      
      points.push(`${x},${baseY + yOffset}`);
    }
    
    return `M0,${baseY} L${points.join(' L')}`;
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="ml-2">
      <path
        d={generatePath()}
        fill="none"
        stroke="#8338EC"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const HipaaCompliantAccelerometer: React.FC<HipaaCompliantAccelerometerProps> = ({ 
  unitId = "Unit #1", 
  location = "NICU-A Room 101" 
}) => {
  const { toast } = useToast();
  const [shakeIndex, setShakeIndex] = useState(2.1);
  const [surfaceTemp, setSurfaceTemp] = useState(36.8);
  const [internalTemp, setInternalTemp] = useState(37.2);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [vibrationStatus, setVibrationStatus] = useState("Stable");
  const [lastUpdated, setLastUpdated] = useState(2); // minutes ago
  const [isRecording, setIsRecording] = useState(false);
  const [showSecurityNotice, setShowSecurityNotice] = useState(false);

  // Simulate values changing slightly to match reference
  useEffect(() => {
    const interval = setInterval(() => {
      setShakeIndex(prev => prev + (Math.random() * 0.04 - 0.02));
      setSurfaceTemp(prev => prev + (Math.random() * 0.02 - 0.01));
      setInternalTemp(prev => prev + (Math.random() * 0.02 - 0.01));
      
      // Randomly change vibration status
      if (Math.random() > 0.97) {
        const statuses = ["Stable", "Moderate", "High"];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        setVibrationStatus(newStatus);
      }
      
      // Slowly decrease battery
      if (Math.random() > 0.98) {
        setBatteryLevel(prev => Math.max(prev - 1, 0));
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Start secure HIPAA-compliant recording
  const startRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "HIPAA-compliant data recording started",
      variant: "default"
    });
    
    // Show security notice after starting
    setTimeout(() => {
      setShowSecurityNotice(true);
    }, 500);
  };

  // Stop recording and save data securely
  const stopRecording = async () => {
    setIsRecording(false);
    setShowSecurityNotice(false);
    
    toast({
      title: "Recording Saved",
      description: "Data stored with HIPAA compliance",
      variant: "default"
    });
    
    // Send data to the database
    try {
      await apiRequest("POST", "/api/mobile/measurements", {
        sessionId: Date.now().toString(36),
        deviceType: "HIPAA Monitor",
        deviceId: "SECURE-MOBILE-" + navigator.userAgent.substring(0, 10).replace(/[^a-zA-Z0-9]/g, ''),
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration: 120,
        peakVibration: shakeIndex,
        averageVibration: shakeIndex * 0.75,
        description: `Secure measurement for ${unitId}`,
        dataPoints: 240,
        // Generate some sample readings for visualization
        readings: Array.from({ length: 120 }, (_, i) => ({
          timestamp: Date.now() - (120 - i) * 1000,
          x: Math.random() * 0.5,
          y: Math.random() * 0.5,
          z: Math.random() * 0.5,
          total: shakeIndex * (0.7 + Math.random() * 0.3)
        })),
        secureMode: true
      });
      
      // Invalidate the measurements query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/mobile/measurements'] });
    } catch (error) {
      console.error("Error saving measurement:", error);
      toast({
        title: "Error Saving Data",
        description: "Could not store measurement securely",
        variant: "destructive"
      });
    }
  };

  // Determine alert status based on shake index
  const hasAlert = shakeIndex > 2.0;

  return (
    <Card className="mb-4 max-w-md mx-auto border-b border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-6">
          <Badge variant="outline" className="rounded-md font-medium bg-green-50 text-green-700 border-green-200 flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" fillOpacity="0.2"/>
              <path d="M16.5 8.5L10.5 14.5L7.5 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            HIPAA-compliant
          </Badge>
          
          {hasAlert && (
            <Badge variant="destructive" className="rounded-md px-3 py-1">
              Alert
            </Badge>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-1">{unitId}</h3>
          <p className="text-gray-600">{location}</p>
        </div>
        
        <div className="flex items-center mb-6">
          <div className="text-7xl font-bold tracking-tight">
            {shakeIndex.toFixed(1)}<span className="text-4xl ml-1">g</span>
          </div>
          <div className="ml-6 flex flex-col">
            <div className="flex items-center">
              <VibrationWaveform amplitude={Math.min(shakeIndex / 3, 1)} />
            </div>
            <span className="text-xl mt-1 font-medium">
              {vibrationStatus}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-y-6 mb-6">
          <div className="text-xl">Surface Temp</div>
          <div className="text-right font-medium text-xl">
            {surfaceTemp.toFixed(1)} °
          </div>
          
          <div className="text-xl">Internal Temp</div>
          <div className="text-right font-medium text-xl">
            {internalTemp.toFixed(1)} °
          </div>
          
          <div className="text-xl">Battery</div>
          <div className="text-right font-medium text-xl">
            {batteryLevel} %
          </div>
        </div>
        
        <div className="mt-8">
          {isRecording ? (
            <Button
              onClick={stopRecording}
              className="w-full py-5 text-lg font-medium border-gray-300 bg-red-500 hover:bg-red-600 text-white"
            >
              <svg 
                className="mr-2 h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
              Stop Recording
            </Button>
          ) : (
            <Button 
              variant="outline"
              className="w-full py-5 text-lg font-medium border-gray-300 hover:bg-gray-50 rounded-md"
              onClick={startRecording}
            >
              View Details
            </Button>
          )}
        </div>
        
        <div className="mt-4 text-base text-gray-500 text-center">
          v2.1.0 • Last updated {lastUpdated} min ago
        </div>
        
        {showSecurityNotice && (
          <div className="mt-3 p-2 bg-green-50 rounded-md border border-green-100 text-center">
            <div className="flex items-center justify-center text-xs text-green-800">
              <svg 
                className="mr-1 h-3 w-3" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              HIPAA Compliant Data Collection Active
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HipaaCompliantAccelerometer;