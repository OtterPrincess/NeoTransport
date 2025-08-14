import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/dashboard/header";
import TabNavigation from "@/components/dashboard/tab-navigation";
import FilterBar from "@/components/dashboard/filter-bar";
import UnitCard from "@/components/dashboard/unit-card-new";
import Footer from "@/components/dashboard/footer";
import type { UnitWithTelemetry } from "@shared/schema";

export default function Dashboard() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-6 py-6 flex-grow">
        {/* Overview Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{units.filter(u => u.status === 'normal').length}</p>
                <p className="text-sm text-slate-600">Normal</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{units.filter(u => u.status === 'warning').length}</p>
                <p className="text-sm text-slate-600">Warning</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{units.filter(u => u.status === 'alert').length}</p>
                <p className="text-sm text-slate-600">Alert</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 1v6m0 10v6m11-7h-6m-10 0H1" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{units.filter(u => u.status === 'offline').length}</p>
                <p className="text-sm text-slate-600">Offline</p>
              </div>
            </div>
          </div>
        </div>

        <FilterBar 
          onApplyFilters={handleApplyFilters} 
          units={units.map(unit => ({ id: unit.id, unitId: unit.unitId }))}
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 text-lg">Loading transport units...</p>
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.901-6.06 2.37M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              </svg>
            </div>
            <p className="text-slate-600 text-lg mb-2">No units found</p>
            <p className="text-slate-500">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUnits.map(unit => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
