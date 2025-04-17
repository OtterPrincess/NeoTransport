import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const ThemeContext = React.createContext<{ isDarkMode: boolean; toggleTheme: () => void }>({
  isDarkMode: false,
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
  };

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('isDarkMode');
    if (storedDarkMode) {
      setIsDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div className={isDarkMode ? 'dark' : ''}>{children}</div>
    </ThemeContext.Provider>
  );
};

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = React.useContext(ThemeContext);
  return (
    <Button onClick={toggleTheme} variant="ghost" className="p-2 rounded-full">
      <Icon name={isDarkMode ? 'sun' : 'moon'} size={20} />
    </Button>
  );
};


export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlertsCount, setActiveAlertsCount] = useState<number>(0);
  const { isDarkMode } = React.useContext(ThemeContext);

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
    <header className={`bg-${isDarkMode ? 'gray-800' : 'white'} text-${isDarkMode ? 'gray-100' : '[#6A1B9A]'} shadow-md`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill={isDarkMode ? 'gray-300' : '#6A1B9A'}/>
            <path d="M28 12C25.5 18 20 20 20 20C20 20 14.5 18 12 12C9.5 6 20 6 20 6C20 6 30.5 6 28 12Z" fill={isDarkMode ? 'gray-600' : 'white'}/>
          </svg>
          <h1 className="text-xl font-semibold">Nestara Live Monitor</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            <span>{formattedTime}</span> <span>{formattedDate}</span>
          </span>
          <Button 
            variant="default" 
            className={`bg-${isDarkMode ? 'purple-700' : '[#9C27B0]'} hover:bg-${isDarkMode ? 'purple-700/90' : '[#9C27B0]/90'} text-${isDarkMode ? 'gray-100' : 'white'} p-2 rounded-md flex items-center`}
            onClick={handleRefresh}
          >
            <Icon name="refresh" size={20} className="mr-1" />
            Refresh
          </Button>
          <ThemeToggle/>
          <div className="relative">
            <Button variant="ghost" className={`bg-${isDarkMode ? 'gray-800' : 'white'} text-${isDarkMode ? 'gray-100' : '[#6A1B9A]'} p-2 rounded-full`}>
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

const App = () => {
  return (
    <ThemeProvider>
      <Header />
    </ThemeProvider>
  );
};

export default App;