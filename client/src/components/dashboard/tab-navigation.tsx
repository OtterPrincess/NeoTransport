import React from "react";
import { Link, useLocation } from "wouter";

export const TabNavigation: React.FC = () => {
  const [location] = useLocation();
  
  const tabs = [
    { name: "Dashboard", path: "/" },
    { name: "Mobile Measurements", path: "/mobile-measurements" },
    { name: "Alert History", path: "/alerts" },
    { name: "Compatible Items", path: "/items" },
    { name: "Soundscape", path: "/soundscape" },
    { name: "Transport Partners", path: "/transport-icons" },
    { name: "Settings", path: "/settings" }
  ];
  
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <nav className="flex overflow-x-auto scrollbar-hide" aria-label="Main Navigation">
          {tabs.map((tab) => {
            const isActive = 
              (tab.path === "/" && location === "/") || 
              (tab.path !== "/" && location.startsWith(tab.path));
            
            return (
              <Link key={tab.path} href={tab.path}>
                <button
                  role="tab"
                  aria-selected={isActive}
                  className={`
                    whitespace-nowrap px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm border-b-2 transition-colors duration-200
                    ${isActive 
                      ? 'border-purple-600 text-purple-600 bg-purple-50' 
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'}
                  `}
                >
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">
                    {tab.name === "Dashboard" ? "Home" :
                     tab.name === "Mobile Measurements" ? "Mobile" :
                     tab.name === "Alert History" ? "Alerts" :
                     tab.name === "Compatible Items" ? "Items" :
                     tab.name === "Soundscape" ? "Sound" :
                     tab.name === "Transport Partners" ? "Partners" :
                     tab.name === "Settings" ? "Settings" : tab.name}
                  </span>
                </button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
