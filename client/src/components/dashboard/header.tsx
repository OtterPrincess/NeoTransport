import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import logoImage from "@assets/image_1745883835132.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlertsCount, setActiveAlertsCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const { appleWatchIntegration, appleWatchModel } = useAppSettings();
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  
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

  const handleLogout = async () => {
    await logout();
    setLocation('/auth');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchTerm);
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Medical Logo */}
          <div className="bg-slate-100 border border-slate-200 rounded-lg p-2 shadow-sm">
            <img 
              src={logoImage} 
              alt="Nestara Medical" 
              className="h-8 w-8 object-contain"
            />
          </div>
          
          {/* Hospital System Branding */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              <span className="text-slate-800">NESTARA</span>
              <span className="text-slate-600 ml-2 text-sm font-normal hidden lg:inline">Medical Transport System</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              Neonatal Care Monitoring • Real-time Patient Safety
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search bar - responsive */}
          <form onSubmit={handleSearch} className="relative hidden sm:flex">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search units, alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 sm:w-80 h-9 pl-10 pr-4 border border-slate-200 text-slate-900 bg-white focus-visible:ring-slate-400 focus-visible:border-slate-400"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon name="search" size={16} className="text-slate-400" />
              </div>
            </div>
            <Button type="submit" size="sm" variant="ghost" className="absolute right-1 top-1 h-7 px-2">
              <Icon name="arrow-right" size={14} className="text-slate-600" />
            </Button>
          </form>

          {/* System Status Indicators */}
          <div className="flex items-center space-x-3">
            {/* Active Alerts Indicator */}
            {activeAlertsCount > 0 && (
              <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1 hidden sm:flex">
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
              <span className="text-xs text-slate-500 ml-2 hidden md:inline">{formattedDate}</span>
            </div>

            {/* Apple Watch Integration Status */}
            {appleWatchIntegration && (
              <div className="hidden md:flex items-center bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs font-medium text-green-700">
                  Watch Connected
                </span>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            className="bg-white hover:bg-[#F3E5F5] text-[#9C27B0] border border-[#E1BEE7] rounded-md flex items-center shadow-sm hover:shadow-md transition-all duration-200"
            onClick={handleRefresh}
          >
            <Icon name="refresh-cw" size={16} className="mr-1.5" />
            Refresh
          </Button>
          <div className="relative">
            <Button variant="ghost" className="bg-white text-[#6A1B9A] p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
              <Icon name="notification" size={20} />
            </Button>
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E53935] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                {activeAlertsCount}
              </span>
            )}
          </div>
          
          {/* User profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-[#E1BEE7] hover:border-[#9C27B0]/40 transition-colors duration-200">
                  <AvatarImage src="" alt={user?.displayName || user?.username || "User"} />
                  <AvatarFallback className="bg-[#F3E5F5] text-[#4A148C] text-sm">
                    {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 
                     (user?.username ? user.username.substring(0, 2).toUpperCase() : "U")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.displayName || user?.username || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.role || "Unknown role"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setLocation('/settings')}>
                  <Icon name="settings" className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/profile')}>
                  <Icon name="user" className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <Icon name="log-out" className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
