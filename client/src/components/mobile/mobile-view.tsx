import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MobileUnitCard from './mobile-unit-card';
import type { UnitWithTelemetry } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MobileView: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  
  const { data: units, isLoading, error } = useQuery<UnitWithTelemetry[]>({
    queryKey: ['/api/units'],
    enabled: true,
    refetchInterval: 30000 // Refresh every 30 seconds
  });
  
  // Find the unit with the most recent alert (if any)
  useEffect(() => {
    if (units && units.length > 0) {
      // Find units with active alerts
      const unitsWithAlerts = units.filter(
        unit => unit.alerts && unit.alerts.some(alert => alert.status === 'active')
      );
      
      if (unitsWithAlerts.length > 0) {
        // Sort by most recent alert
        const sortedUnits = [...unitsWithAlerts].sort((a, b) => {
          const aLatestAlert = a.alerts.reduce((latest, alert) => 
            alert.status === 'active' && new Date(alert.timestamp) > new Date(latest.timestamp) 
              ? alert : latest, a.alerts[0]);
          
          const bLatestAlert = b.alerts.reduce((latest, alert) => 
            alert.status === 'active' && new Date(alert.timestamp) > new Date(latest.timestamp) 
              ? alert : latest, b.alerts[0]);
          
          return new Date(bLatestAlert.timestamp).getTime() - new Date(aLatestAlert.timestamp).getTime();
        });
        
        // Select the unit with the most recent alert
        setSelectedUnit(sortedUnits[0].id);
      } else {
        // If no alerts, select the first unit
        setSelectedUnit(units[0].id);
      }
    }
  }, [units]);
  
  const selectedUnitData = units?.find(unit => unit.id === selectedUnit);
  
  // Accelerometer app version
  const appVersion = "v2.1.0";
  
  return (
    <div className="container px-4 py-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-libre text-gray-900">Mobile Measurements</h1>
        <div className="text-xs bg-[#E1BEE7] text-[#4A148C] px-2 py-1 rounded-md font-medium">
          Accelerometer App {appVersion}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-[#9C27B0] border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error loading data. Please refresh the page.
        </div>
      ) : units && units.length > 0 ? (
        <>
          <Tabs defaultValue={selectedUnit?.toString() || "all"} className="w-full mb-4">
            <TabsList className="w-full overflow-x-auto">
              {units.map(unit => (
                <TabsTrigger 
                  key={unit.id} 
                  value={unit.id.toString()}
                  onClick={() => setSelectedUnit(unit.id)}
                  className="relative"
                >
                  {unit.unitId}
                  {unit.alerts && unit.alerts.some(alert => alert.status === 'active') && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {units.map(unit => (
              <TabsContent key={unit.id} value={unit.id.toString()}>
                <MobileUnitCard unit={unit} />
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Real-time Measurement</h2>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-center text-gray-500 mb-2">
                To take real-time measurements, place your device on the unit tray
              </p>
              <button className="w-full bg-[#6A1B9A] hover:bg-[#8E24AA] text-white py-3 rounded-lg font-medium">
                Start New Measurement
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
          No units found. Please check your connection.
        </div>
      )}
    </div>
  );
};

export default MobileView;