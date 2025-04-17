import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlertsCount, setActiveAlertsCount] = useState<number>(0);
  
  // Update the time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Fetch active alerts count
  useEffect(() => {
    const fetchActiveAlerts = async () => {
      try {
        const response = await fetch('/api/alerts?status=active');
        if (response.ok) {
          const alerts = await response.json();
          setActiveAlertsCount(alerts.length);
        }
      } catch (error) {
        console.error('Failed to fetch active alerts:', error);
      }
    };
    
    fetchActiveAlerts();
    const interval = setInterval(fetchActiveAlerts, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
  
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="bg-gradient-to-r from-[#6A1B9A] to-[#9C27B0] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-md shadow-lg flex items-center justify-center border-2 border-[#E1BEE7]/40">
            <div className="w-11 h-11 font-bold flex items-center justify-center overflow-hidden">
              <svg width="40" height="40" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
                {/* Main logo group */}
                <g>
                  {/* Large circle (right/top) */}
                  <path d="M114.73 43.8928C124.01 42.7368 130.595 34.2775 129.439 24.9982C128.283 15.719 119.824 9.13389 110.544 10.2898C101.265 11.4458 94.6799 19.9052 95.8359 29.1844C96.9918 38.4636 105.451 45.0488 114.73 43.8928Z" stroke="#662C6C" strokeWidth="9.23529" fill="none"/>
                  
                  {/* Small circle (left) */}
                  <path d="M48.1748 94.8395C51.9709 94.3666 54.6648 90.906 54.1919 87.1099C53.719 83.3139 50.2584 80.62 46.4623 81.0929C42.6663 81.5658 39.9723 85.0264 40.4452 88.8225C40.9181 92.6185 44.3788 95.3124 48.1748 94.8395Z" fill="#662C6C" stroke="#662C6C" strokeWidth="4.61765"/>
                  
                  {/* Crescent moon curve */}
                  <path d="M13.5254 89.8781C16.5889 104.937 103.623 145.324 141.843 36.666" stroke="#662C6C" strokeWidth="7.69608" strokeLinecap="round" fill="none"/>
                  
                  {/* Moon fill */}
                  <path d="M145.955 42.185C145.955 38.4995 145.606 33.5818 143.5 33.9995C141.394 34.4171 137.911 41.561 138.33 43.6975L145.955 42.185ZM11.5 93.6261C25.865 128.177 68.9139 146.203 100.619 139.322C116.631 135.847 131.04 126.429 139.875 110.179C148.679 93.9874 150 71.4995 145.955 42.185L138.33 43.6975C143.5 70.0355 140.729 92.2555 133.063 106.355C125.429 120.396 113.034 128.56 98.9663 131.614C70.5113 137.789 41.5 127.602 21.6202 93.6261H11.5Z" fill="#662C6C"/>
                </g>
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#E1BEE7] tracking-wide flex items-center">
              <span className="font-light mr-1">nest</span><span className="font-bold">ara</span>
              <span className="bg-[#4A148C] text-white text-xs px-1.5 py-0.5 rounded-sm ml-2 uppercase tracking-tight font-medium">Pro</span>
            </h1>
            <div className="flex items-center">
              <span className="text-xs tracking-wider text-[#E1BEE7]/90 font-medium">Neonatal Transport Monitoring System</span>
              <span className="bg-[#E1BEE7]/20 h-4 w-px mx-2"></span>
              <span className="text-[10px] text-white/70 bg-[#4A148C]/40 px-1.5 py-0.5 rounded-full">v2.1</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-[#4A148C]/30 px-3 py-1 rounded-md text-sm hidden md:block">
            <span className="font-medium">{formattedTime}</span>
            <span className="mx-2 opacity-50">|</span>
            <span>{formattedDate}</span>
          </div>
          <Button 
            variant="default" 
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 rounded-md flex items-center shadow-md transition-all duration-200"
            onClick={handleRefresh}
          >
            <Icon name="refresh" size={18} className="mr-1.5" />
            Refresh
          </Button>
          <div className="relative">
            <Button variant="ghost" className="bg-white text-[#6A1B9A] p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
              <Icon name="notification" size={20} />
            </Button>
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E53935] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
