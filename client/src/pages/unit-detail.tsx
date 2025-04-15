import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/dashboard/header";
import TabNavigation from "@/components/dashboard/tab-navigation";
import Footer from "@/components/dashboard/footer";
import Icon from "@/components/ui/icon";
import UnitInfo from "@/components/unit-detail/unit-info";
import AlertHistory from "@/components/unit-detail/alert-history";
import DeviceInfo from "@/components/unit-detail/device-info";
import LiveNotifications from "@/components/unit-detail/live-notifications";
import type { UnitWithTelemetry } from "@shared/schema";

export default function UnitDetail() {
  // Get unit ID from URL
  const [match, params] = useRoute<{ id: string }>("/unit/:id");
  
  // Fetch unit details
  const { data: unit, isLoading, isError } = useQuery<UnitWithTelemetry>({
    queryKey: [`/api/units/${params?.id}`],
    enabled: !!params?.id,
    refetchInterval: 10000, // Refresh every 10 seconds
  });
  
  // Get status badge style
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'normal':
        return "bg-[#66BB6A] text-white";
      case 'warning':
        return "bg-[#FFA000] text-white";
      case 'alert':
        return "bg-[#E53935] text-white";
      case 'offline':
      default:
        return "bg-[#BDBDBD] text-white";
    }
  };
  
  // Format status for display
  const getStatusDisplay = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  if (!match) {
    return null; // Route doesn't match
  }
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-4 py-4 flex-grow">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-[#616161]">Loading unit details...</p>
          </div>
        ) : isError || !unit ? (
          <div className="text-center py-8">
            <p className="text-[#616161]">Error loading unit details. The unit may not exist.</p>
            <Link href="/">
              <Button className="mt-4">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Link href="/">
                  <Button variant="ghost" className="mr-3 p-1 rounded-full hover:bg-gray-100">
                    <Icon name="back" size={24} className="text-[#6A1B9A]" />
                  </Button>
                </Link>
                <h2 className="text-xl font-semibold">{unit.unitId} Details</h2>
              </div>
              <div>
                <span className={`${getStatusBadgeClass(unit.status)} px-3 py-1 rounded-md text-sm font-medium`}>
                  {getStatusDisplay(unit.status)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <UnitInfo unit={unit} />
                </div>
                
                <div>
                  <AlertHistory alerts={unit.alerts} />
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <LiveNotifications alerts={unit.alerts} />
                </div>
                
                <div>
                  <DeviceInfo unit={unit} />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
