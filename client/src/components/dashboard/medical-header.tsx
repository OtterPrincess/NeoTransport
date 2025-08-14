import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import logoImage from "@assets/image_1745883835132.png";
// Temporarily removed dropdown menu due to hook call issue

export const MedicalHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlertsCount, setActiveAlertsCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const { appleWatchIntegration, appleWatchModel } = useAppSettings();
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  
  // Update time every minute
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
    const interval = setInterval(fetchActiveAlerts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
  
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = async () => {
    await logout();
    setLocation('/auth');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <header className="bg-white border-b-2 border-blue-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        {/* Top Medical Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Medical Logo */}
            <div className="bg-blue-600 rounded-lg p-2 shadow-md">
              <img 
                src={logoImage} 
                alt="Nestara Medical" 
                className="h-8 w-8 object-contain filter brightness-0 invert"
              />
            </div>
            
            {/* Hospital System Branding */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                <span className="text-blue-600">NESTARA</span>
                <span className="text-slate-600 ml-2 text-sm font-normal">Medical Transport System</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                Neonatal Care Monitoring • Real-time Patient Safety
              </p>
            </div>
          </div>

          {/* System Status Indicators */}
          <div className="flex items-center space-x-3">
            {/* Active Alerts Indicator */}
            {activeAlertsCount > 0 && (
              <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {activeAlertsCount} ALERT{activeAlertsCount > 1 ? 'S' : ''}
              </Badge>
            )}

            {/* System Time */}
            <div className="hidden sm:flex items-center bg-slate-100 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-mono font-bold text-slate-900">{formattedTime}</span>
              <span className="text-xs text-slate-500 ml-2">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Navigation and Tools Bar */}
        <div className="flex items-center justify-between">
          {/* Search and Quick Actions */}
          <div className="flex items-center space-x-3">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search patient units, alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 sm:w-80 h-10 pl-10 pr-4 border-2 border-slate-200 text-slate-900 bg-white focus-visible:ring-blue-500 focus-visible:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <Button type="submit" size="sm" variant="ghost" className="absolute right-1 top-1 h-8 px-2">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </Button>
            </form>

            {/* Quick Refresh Button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              className="border-2 border-slate-200 hover:bg-slate-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>

          {/* User Profile and System Controls */}
          <div className="flex items-center space-x-3">
            {/* Apple Watch Integration Status */}
            {appleWatchIntegration && (
              <div className="hidden md:flex items-center bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs font-medium text-green-700">
                  Watch Connected
                </span>
              </div>
            )}

            {/* User Profile - Simple Button */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation('/settings')}
                className="border-2 border-slate-200 hover:bg-slate-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">Settings</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-600"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MedicalHeader;