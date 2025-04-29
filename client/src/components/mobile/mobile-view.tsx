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
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between items-center py-4 border-b border-gray-200 sticky top-0 bg-white z-10 px-4">
        <h1 className="text-3xl font-bold">Mobile Dashboard</h1>
        <div className="flex items-center">
          <span className="mr-4 text-base">Real-Time Data</span>
          <span className="inline-flex items-center text-base">
            <svg className="w-5 h-5 text-green-500 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" fillOpacity="0.2"/>
              <path d="M16.5 8.5L10.5 14.5L7.5 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            HIPAA-compliant
          </span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 px-4 py-3 text-red-700">
          Error loading data. Please refresh the page.
        </div>
      ) : units && units.length > 0 ? (
        <>
          <div className="border-b border-gray-200 overflow-x-auto sticky top-16 bg-white z-10">
            <div className="flex">
              {units.map(unit => (
                <button
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit.id)}
                  className={`whitespace-nowrap px-4 py-3 text-base ${
                    selectedUnit === unit.id 
                      ? 'text-black border-b-2 border-black font-medium' 
                      : 'text-gray-500'
                  }`}
                >
                  Unit #{unit.unitId.replace(/Unit\s*#/i, '')}
                </button>
              ))}
            </div>
          </div>
        
          {selectedUnitData && (
            <div className="px-4">
              <MobileUnitCard unit={selectedUnitData} />
            </div>
          )}
        </>
      ) : (
        <div className="px-4 py-3 text-yellow-700">
          No units found. Please check your connection.
        </div>
      )}
    </div>
  );
};

export default MobileView;