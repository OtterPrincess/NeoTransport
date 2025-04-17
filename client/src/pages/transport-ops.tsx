import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/dashboard/header";
import TabNavigation from "@/components/dashboard/tab-navigation";
import Footer from "@/components/dashboard/footer";
import TransportFilter from "@/components/transport-ops/transport-filter";
import TransportTable from "@/components/transport-ops/transport-table";
import TransportDetailSidebar from "@/components/transport-ops/transport-detail-sidebar";
import type { UnitWithTelemetry } from "@shared/schema";
import type { Transport } from "@/components/transport-ops/transport-types";

export default function TransportOps() {
  // State for filters
  const [filters, setFilters] = useState({
    room: "",
    transportType: "",
    status: "",
    unitId: ""
  });
  
  // State for selected transport
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Fetch units with telemetry data (we'll transform this to transport data later)
  const { data: units = [], isLoading } = useQuery<UnitWithTelemetry[]>({
    queryKey: ['/api/units'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Mock transport data based on units
  // In a real scenario, we'd fetch this from a dedicated endpoint
  const transports: Transport[] = units.map(unit => {
    // Determine transport type based on unit metadata
    const isTransportUnit = unit.unitId.includes('Unit');
    let transportType = 'Intra-hospital';
    
    if (isTransportUnit) {
      transportType = unit.unitId.includes('Air') ? 'Air' : 'Ground';
    }
    
    // Determine status based on unit status
    let transportStatus = 'Completed';
    if (unit.status === 'warning') transportStatus = 'En Route';
    if (unit.status === 'offline') transportStatus = 'Scheduled';
    
    return {
      id: unit.id,
      bedId: isTransportUnit ? unit.unitId : `Bed #${unit.id}`,
      currentLocation: unit.room || 'Unknown',
      lastTransport: isTransportUnit ? 'Transport Unit' : `${unit.room || 'NICU'} → OR`,
      mode: isTransportUnit ? 
        (unit.unitId.includes('Air') ? 'AirMed' : 'Ground EMS') : 
        'Manual Cot',
      duration: Math.floor(Math.random() * 60) + ' min',
      status: transportStatus,
      riskFlags: unit.status === 'alert' ? 'Temp Spike' : 
                unit.status === 'warning' ? 'Vibration Alert' : '',
      unitDetail: unit
    };
  });
  
  // Apply filters
  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };
  
  // Filter transports based on user selections
  const filteredTransports = transports.filter(transport => {
    if (filters.room && transport.currentLocation !== filters.room) return false;
    if (filters.transportType) {
      if (filters.transportType === 'Intra-hospital' && 
          (transport.mode === 'AirMed' || transport.mode === 'Ground EMS')) return false;
      if (filters.transportType === 'Ground' && transport.mode !== 'Ground EMS') return false;
      if (filters.transportType === 'Air' && transport.mode !== 'AirMed') return false;
    }
    if (filters.status && transport.status !== filters.status) return false;
    if (filters.unitId && transport.bedId !== filters.unitId) return false;
    return true;
  });
  
  // Handle transport selection
  const handleSelectTransport = (transport: Transport) => {
    setSelectedTransport(transport);
    setSidebarOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-4 py-4 flex-grow flex relative">
        <div className={`transition-all duration-300 ease-in-out flex-1 ${sidebarOpen ? 'mr-80' : ''}`}>
          <h1 className="text-2xl font-bold text-[#6A1B9A] mb-4">Transport Operations</h1>
          
          <TransportFilter 
            onApplyFilters={handleApplyFilters} 
            units={transports.map(t => ({ id: t.id, bedId: t.bedId }))}
          />
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-[#616161]">Loading transport data...</p>
            </div>
          ) : filteredTransports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#616161]">No transport operations found matching your filters.</p>
            </div>
          ) : (
            <TransportTable 
              transports={filteredTransports} 
              onSelectTransport={handleSelectTransport}
            />
          )}
        </div>
        
        {sidebarOpen && (
          <TransportDetailSidebar
            transport={selectedTransport}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}