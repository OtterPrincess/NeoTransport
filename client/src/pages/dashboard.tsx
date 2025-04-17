import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/dashboard/header";
import TabNavigation from "@/components/dashboard/tab-navigation";
import FilterBar from "@/components/dashboard/filter-bar";
import UnitCard from "@/components/dashboard/unit-card";
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
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-4 py-4 flex-grow">
        <FilterBar 
          onApplyFilters={handleApplyFilters} 
          units={units.map(unit => ({ id: unit.id, unitId: unit.unitId }))}
        />
        
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-[#616161]">Loading units...</p>
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#616161]">No units found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
