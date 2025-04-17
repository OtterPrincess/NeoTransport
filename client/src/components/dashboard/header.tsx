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
          <div className="bg-white p-2 rounded-md shadow-lg flex items-center justify-center">
            <div className="w-7 h-7 text-[#6A1B9A] font-bold flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60 20C65.5 20 70 24.5 70 30C70 35.5 65.5 40 60 40C54.5 40 50 35.5 50 30C50 24.5 54.5 20 60 20ZM60 20C60 20 45 20 35 40C25 60 20 80 20 80M30 40C30 46 25 50 20 50" stroke="#6A1B9A" strokeWidth="10" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#E1BEE7] leading-tight">
              NESTARA
            </h1>
            <span className="text-xs uppercase tracking-wide text-[#E1BEE7]">Neonatal Transport Platform</span>
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
