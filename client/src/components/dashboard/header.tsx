import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
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
    <header className="bg-gradient-to-r from-white to-[#F5F0FF] border-b border-[#E1BEE7] shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-md shadow-sm flex items-center justify-center border border-[#E1BEE7]/20">
            <div className="w-11 h-11 font-bold flex items-center justify-center overflow-hidden">
              <svg width="40" height="40" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(50, 80) scale(1)">
                  {/* Small horizontal line (top left) */}
                  <rect x="130" y="120" width="60" height="12" rx="6" fill="#662C6C" />
                  
                  {/* Medium circle (left) */}
                  <circle cx="200" cy="200" r="60" fill="#662C6C" />
                  
                  {/* Large circle (top right) */}
                  <circle cx="320" cy="120" r="70" fill="#662C6C" />
                  
                  {/* Small horizontal line (bottom left) */}
                  <rect x="120" y="280" width="60" height="12" rx="6" fill="#662C6C" />
                  
                  {/* Longer horizontal line (bottom) */}
                  <rect x="180" y="320" width="120" height="12" rx="6" fill="#662C6C" />
                  
                  {/* Crescent moon shape */}
                  <path d="M140 250 C 180 120, 300 180, 400 250 C 340 350, 200 350, 140 250" 
                        fill="none" stroke="#662C6C" strokeWidth="30" strokeLinecap="round" />
                </g>
              </svg>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#F3E5F5] via-[#E1BEE7] to-[#F3E5F5]/30 rounded-lg blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700"></div>
            <div className="absolute top-0 -left-4 w-20 h-20 bg-gradient-to-tl from-[#9C27B0]/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-all duration-700 group-hover:scale-150"></div>
            <div className="absolute bottom-0 right-0 w-32 h-12 bg-gradient-to-br from-[#F3E5F5] to-[#9C27B0]/10 rounded-full blur-xl opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500"></div>
            
            <h1 className="text-2xl sm:text-3xl tracking-wide flex items-center relative z-10">
              <span className="font-normal text-[#662C6C]">nestara</span>
              <div className="ml-2 h-5 w-0.5 bg-[#662C6C]/20 group-hover:bg-[#662C6C]/30 transition-colors duration-300"></div>
              <span className="ml-2 text-[10px] text-[#662C6C] bg-[#F3E5F5] group-hover:bg-[#E1BEE7] px-2 py-0.5 rounded-full shadow-sm group-hover:shadow-md transition-all duration-300">v2.1</span>
            </h1>
            <div className="flex items-center mt-1 relative z-10">
              <span className="text-xs tracking-wider text-[#662C6C]/80 font-medium leading-tight">Neonatal Transport Monitoring System</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search bar - extended version */}
          <form onSubmit={handleSearch} className="relative hidden md:flex">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search units, alerts, or items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 h-9 pl-10 pr-4 border border-[#E1BEE7] text-[#4A148C] bg-white/80 shadow-sm focus-visible:ring-[#9C27B0]/40"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon name="search" size={16} className="text-[#4A148C]/40" />
              </div>
            </div>
            <Button type="submit" size="sm" variant="ghost" className="absolute right-1 top-1 h-7 px-2">
              <Icon name="arrow-right" size={14} className="text-[#4A148C]/70" />
            </Button>
          </form>

          <div className="bg-[#4A148C]/30 px-3 py-1 rounded-md text-sm hidden md:block">
            <span className="font-medium">{formattedTime}</span>
            <span className="mx-2 opacity-50">|</span>
            <span>{formattedDate}</span>
          </div>
          
          {/* Apple Watch Status Indicator */}
          {appleWatchIntegration && (
            <div className="hidden md:flex items-center bg-[#4A148C]/10 px-2 py-1 rounded-md border border-[#4A148C]/20">
              <div className="h-3 w-3 rounded-full bg-[#66BB6A] mr-1.5"></div>
              <span className="text-xs font-medium text-[#4A148C]">
                Watch {appleWatchModel.includes('ultra') ? 'Ultra' : 'Series'} Alerts
              </span>
            </div>
          )}
          
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
