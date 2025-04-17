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
            <div className="w-10 h-10 text-[#6A1B9A] font-bold flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Moon face base */}
                <path d="M50 90C72 90 90 72 90 50C90 28 72 10 50 10C28 10 10 28 10 50C10 72 28 90 50 90Z" fill="#6A1B9A"/>
                
                {/* Moon crescent (lighter area) */}
                <path d="M50 90C65 90 78 80 83 65C75 75 60 80 45 75C30 70 20 55 25 40C30 25 45 15 60 20C55 15 45 10 35 10C20 15 10 30 10 50C10 72 28 90 50 90Z" fill="white" fillOpacity="0.2"/>
                
                {/* Smile */}
                <path d="M30 65C35 75 65 75 70 65" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                
                {/* Left circle (smaller) */}
                <circle cx="30" cy="30" r="8" fill="#6A1B9A" stroke="white" strokeWidth="2"/>
                
                {/* Right circle (larger) */}
                <circle cx="70" cy="30" r="12" fill="#6A1B9A" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#E1BEE7] leading-tight tracking-wide">
              NESTARA
            </h1>
            <span className="text-xs uppercase tracking-wider text-[#E1BEE7] font-medium">Neonatal Transport Platform</span>
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
