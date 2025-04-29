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
    <div className="container mx-auto mt-4 px-4">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-2" aria-label="Main Navigation">
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
                    px-4 py-2 font-medium text-sm rounded-t-lg focus:outline-none focus:ring-2 focus:ring-[#6A1B9A]
                    ${isActive 
                      ? 'bg-[#6A1B9A] text-white' 
                      : 'text-[#616161] hover:bg-[#F3E5F5]'}
                  `}
                >
                  {tab.name}
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
