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
    <header className="bg-[#6A1B9A] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg width="32" height="32" viewBox="0 0 178 194" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_294_672)">
              <path d="M114.73 43.8936C124.01 42.7376 130.595 34.2783 129.439 24.999C128.283 15.7198 119.824 9.13464 110.544 10.2906C101.265 11.4466 94.6799 19.906 95.8359 29.1852C96.9918 38.4644 105.451 45.0496 114.73 43.8936Z" stroke="#662C6C" stroke-width="9.23529"/>
              <path d="M48.1748 94.8404C51.9709 94.3675 54.6648 90.9069 54.1919 87.1108C53.719 83.3148 50.2584 80.6209 46.4623 81.0938C42.6663 81.5667 39.9723 85.0273 40.4452 88.8234C40.9181 92.6194 44.3788 95.3133 48.1748 94.8404Z" fill="#662C6C" stroke="#662C6C" stroke-width="4.61765"/>
              <path d="M13.5254 89.8779C16.5889 104.937 103.624 145.324 141.843 36.6658" stroke="#662C6C" stroke-width="7.69608" stroke-linecap="round"/>
              <path d="M145.955 42.1855C145.955 38.5 145.606 33.5823 143.5 34C141.394 34.4176 137.911 41.5615 138.33 43.698L145.955 42.1855ZM11.5 93.6266C25.865 128.177 68.9139 146.203 100.619 139.322C116.631 135.847 131.04 126.429 139.875 110.179C148.679 93.9879 150 71.5 145.955 42.1855L138.33 43.698C143.5 70.036 140.729 92.256 133.063 106.355C125.429 120.396 113.034 128.56 98.9663 131.614C70.5113 137.789 41.5 127.602 21.6202 93.6266L11.5 93.6266Z" fill="#662C6C"/>
            </g>
            <defs>
              <clipPath id="clip0_294_672">
                <rect width="157" height="175.471" fill="white" transform="translate(0 19.4084) rotate(-7.10109)"/>
              </clipPath>
            </defs>
          </svg>
          <h1 className="text-xl font-semibold">Nestara Live Monitor</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            <span>{formattedTime}</span> <span>{formattedDate}</span>
          </span>
          <Button 
            variant="default" 
            className="bg-[#9C27B0] hover:bg-[#9C27B0]/90 text-white p-2 rounded-md flex items-center"
            onClick={handleRefresh}
          >
            <Icon name="refresh" size={20} className="mr-1" />
            Refresh
          </Button>
          <div className="relative">
            <Button variant="ghost" className="bg-white text-[#6A1B9A] p-2 rounded-full">
              <Icon name="notification" size={20} />
            </Button>
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E53935] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
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
