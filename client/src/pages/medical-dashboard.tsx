import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UnitWithTelemetry } from "@shared/schema";
import MedicalHeader from "@/components/dashboard/medical-header";
import MedicalUnitCard from "@/components/dashboard/medical-unit-card";
import Footer from "@/components/dashboard/footer";
import { cn } from "@/lib/utils";

export default function MedicalDashboard() {
  const [filters, setFilters] = useState({
    room: "",
    unitId: "",
    status: "",
    bed: ""
  });

  // Fetch units with telemetry data
  const { data: units = [], isLoading } = useQuery<UnitWithTelemetry[]>({
    queryKey: ['/api/units'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Apply filters
  const filteredUnits = units.filter(unit => {
    if (filters.room && unit.room !== filters.room) return false;
    if (filters.unitId && unit.unitId !== filters.unitId) return false;
    if (filters.status && unit.status !== filters.status) return false;
    if (filters.bed && (!unit.location || !unit.location.includes(filters.bed))) return false;
    return true;
  });

  // Calculate statistics for medical overview
  const stats = {
    total: units.length,
    normal: units.filter(u => u.status === 'normal').length,
    warning: units.filter(u => u.status === 'warning').length,
    alert: units.filter(u => u.status === 'alert').length,
    offline: units.filter(u => u.status === 'offline').length,
    critical: units.filter(u => u.status === 'alert').length // Critical = Alert for medical context
  };

  const criticalAlerts = units.filter(u => u.status === 'alert');
  const recentActivity = units.filter(u => u.telemetry?.timestamp && 
    new Date().getTime() - new Date(u.telemetry.timestamp).getTime() < 5 * 60 * 1000 // 5 minutes
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <MedicalHeader />
      
      {/* Medical Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <nav className="flex space-x-8" aria-label="Medical Navigation">
            {[
              { name: "Patient Monitor", path: "/", icon: "monitor", active: true },
              { name: "Mobile Units", path: "/mobile-measurements", icon: "smartphone" },
              { name: "Alert Center", path: "/alerts", icon: "bell" },
              { name: "Equipment", path: "/items", icon: "package" },
              { name: "Audio Alerts", path: "/soundscape", icon: "volume-2" },
              { name: "Transport", path: "/transport-icons", icon: "truck" },
              { name: "System", path: "/settings", icon: "settings" }
            ].map((tab) => (
              <button
                key={tab.path}
                className={cn(
                  "flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors duration-200",
                  tab.active 
                    ? "border-blue-600 text-blue-600 bg-blue-50" 
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                )}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {tab.icon === "monitor" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                  {tab.icon === "smartphone" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />}
                  {tab.icon === "bell" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />}
                  {tab.icon === "package" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />}
                  {tab.icon === "volume-2" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6.343 6.343A8 8 0 004.222 18.94" />}
                  {tab.icon === "truck" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4-5v9" />}
                  {tab.icon === "settings" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />}
                </svg>
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* Medical Statistics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* Total Units */}
          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Units</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.901-6.06 2.37M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Normal Status */}
          <Card className="bg-white border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Stable</p>
                  <p className="text-2xl font-bold text-green-600">{stats.normal}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning Status */}
          <Card className="bg-white border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Warning</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.warning}</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical/Alert Status */}
          <Card className="bg-white border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{stats.alert}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offline Status */}
          <Card className="bg-white border-l-4 border-l-slate-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Offline</p>
                  <p className="text-2xl font-bold text-slate-600">{stats.offline}</p>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 1v6m0 10v6m11-7h-6m-10 0H1" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Monitoring */}
          <Card className="bg-white border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Active</p>
                  <p className="text-2xl font-bold text-purple-600">{recentActivity.length}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts Banner */}
        {criticalAlerts.length > 0 && (
          <Card className="bg-red-50 border-l-4 border-l-red-500 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-bold text-red-800">CRITICAL ALERTS ACTIVE</h3>
                    <p className="text-xs text-red-600">
                      {criticalAlerts.length} unit{criticalAlerts.length > 1 ? 's' : ''} require immediate attention
                    </p>
                  </div>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  View Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medical Units Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 text-lg">Loading patient monitoring units...</p>
            <p className="text-slate-500 text-sm">Establishing secure connections...</p>
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.901-6.06 2.37M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              </svg>
            </div>
            <p className="text-slate-600 text-lg mb-2">No monitoring units found</p>
            <p className="text-slate-500">Check system connections or adjust filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUnits.map(unit => (
              <MedicalUnitCard 
                key={unit.id} 
                unit={unit} 
                onViewDetails={(unitId) => {
                  console.log('View details for unit:', unitId);
                }}
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}