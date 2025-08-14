import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UnitWithTelemetry } from "@shared/schema";
import Header from "@/components/dashboard/header";
import UnitCard from "@/components/dashboard/unit-card-new";
import TabNavigation from "@/components/dashboard/tab-navigation";
import FilterBar from "@/components/dashboard/filter-bar";
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

  // Apply filters function
  const handleApplyFilters = (newFilters: { room: string; unitId: string; status: string; bed: string }) => {
    setFilters(newFilters);
  };
  
  // Filter units based on user selections
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col">
      <Header />
      <TabNavigation />

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-grow">
        {/* Filter Bar */}
        <FilterBar onApplyFilters={handleApplyFilters} units={units} />
        
        {/* Compact Medical Statistics Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="px-4 py-3">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Total Units */}
              <div className="flex items-center space-x-3 p-2 border-l-4 border-l-slate-400">
                <div className="w-5 h-5 text-slate-500">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" strokeWidth={1.5}>
                    <rect x="3" y="4" width="18" height="16" rx="2"/>
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{stats.total}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Total Units</p>
                </div>
              </div>

              {/* Stable */}
              <div className="flex items-center space-x-3 p-2 border-l-4 border-l-green-500">
                <div className="w-5 h-5 text-green-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" strokeWidth={1.5}>
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{stats.normal}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Stable</p>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-center space-x-3 p-2 border-l-4 border-l-amber-500">
                <div className="w-5 h-5 text-amber-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" strokeWidth={1.5}>
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M12 8v4m0 4h.01"/>
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{stats.warning}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Warning</p>
                </div>
              </div>

              {/* Critical */}
              <div className="flex items-center space-x-3 p-2 border-l-4 border-l-red-500">
                <div className="w-5 h-5 text-red-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" strokeWidth={1.5}>
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M12 8v4m0 4h.01"/>
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{stats.alert}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Critical</p>
                </div>
              </div>

              {/* Offline */}
              <div className="flex items-center space-x-3 p-2 border-l-4 border-l-slate-300">
                <div className="w-5 h-5 text-slate-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" strokeWidth={1.5}>
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M15 9l-6 6m0-6l6 6"/>
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{stats.offline}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Offline</p>
                </div>
              </div>

              {/* Active */}
              <div className="flex items-center space-x-3 p-2 border-l-4 border-l-purple-500">
                <div className="w-5 h-5 text-purple-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" strokeWidth={1.5}>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{recentActivity.length}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Active</p>
                </div>
              </div>
            </div>
          </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredUnits.map(unit => (
              <UnitCard 
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