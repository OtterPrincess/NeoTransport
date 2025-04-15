import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import Header from "@/components/dashboard/header";
import TabNavigation from "@/components/dashboard/tab-navigation";
import Footer from "@/components/dashboard/footer";
import Icon from "@/components/ui/icon";
import { formatDate } from "@/lib/utils";
import type { Alert, Unit } from "@shared/schema";

export default function AlertHistory() {
  const [unitFilter, setUnitFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  
  // Fetch all alerts
  const { data: alerts = [], isLoading: isLoadingAlerts } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Fetch all units for filtering
  const { data: units = [], isLoading: isLoadingUnits } = useQuery<Unit[]>({
    queryKey: ['/api/units'],
  });
  
  // Apply filters
  const filteredAlerts = alerts.filter(alert => {
    if (unitFilter && unitFilter !== "all" && alert.unitId.toString() !== unitFilter) return false;
    if (statusFilter && statusFilter !== "all" && alert.status !== statusFilter) return false;
    if (dateFilter) {
      const alertDate = new Date(alert.timestamp).toISOString().split('T')[0];
      if (alertDate !== dateFilter) return false;
    }
    return true;
  });
  
  // Sort alerts by timestamp (most recent first)
  const sortedAlerts = [...filteredAlerts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Find unit name by ID
  const getUnitName = (unitId: number): string => {
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.unitId : `Unit ID ${unitId}`;
  };
  
  // Get alert type display text
  const getAlertTypeDisplay = (type: string): string => {
    switch (type) {
      case 'temperature':
        return 'Temperature Alert';
      case 'vibration':
        return 'Vibration Alert';
      case 'battery':
        return 'Battery Alert';
      case 'maintenance':
        return 'Maintenance Alert';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-[#E53935] text-white';
      case 'acknowledged':
        return 'bg-[#FFA000] text-white';
      case 'resolved':
        return 'bg-[#66BB6A] text-white';
      default:
        return 'bg-gray-200 text-[#616161]';
    }
  };
  
  const handleExport = () => {
    // Create CSV content
    const headers = ["Time", "Unit", "Event", "Value", "Status", "Acknowledged By"];
    const rows = sortedAlerts.map(alert => [
      format(new Date(alert.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      getUnitName(alert.unitId),
      getAlertTypeDisplay(alert.alertType),
      alert.value || 'N/A',
      alert.status,
      alert.acknowledgedBy || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nestara-alerts-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-4 py-4 flex-grow">
        <h1 className="text-2xl font-semibold mb-4">Alert History</h1>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="unit-filter" className="text-sm font-medium text-[#616161] mb-1">Unit</Label>
                <Select value={unitFilter} onValueChange={setUnitFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Units" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="all-units" value="all">All Units</SelectItem>
                    {units.map(unit => (
                      <SelectItem key={`unit-${unit.id}`} value={unit.id.toString()}>{unit.unitId}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status-filter" className="text-sm font-medium text-[#616161] mb-1">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="all-status" value="all">All Status</SelectItem>
                    <SelectItem key="status-active" value="active">Active</SelectItem>
                    <SelectItem key="status-acknowledged" value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem key="status-resolved" value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date-filter" className="text-sm font-medium text-[#616161] mb-1">Date</Label>
                <Input 
                  id="date-filter" 
                  type="date" 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full border-[#6A1B9A] text-[#6A1B9A] hover:bg-[#6A1B9A]/5"
                  onClick={handleExport}
                >
                  <Icon name="upload" size={16} className="mr-1" />
                  Export to CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            {isLoadingAlerts || isLoadingUnits ? (
              <div className="text-center py-8">
                <p className="text-[#616161]">Loading alerts...</p>
              </div>
            ) : sortedAlerts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#616161]">No alerts found matching your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider">Time</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider">Unit</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider">Event</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider">Value</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedAlerts.map(alert => (
                      <tr key={alert.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-[#212121]">
                          {formatDate(alert.timestamp)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {getUnitName(alert.unitId)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {getAlertTypeDisplay(alert.alertType)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          {alert.value || 'N/A'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(alert.status)}`}>
                            {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {alert.status === 'active' ? (
                            <Button 
                              variant="ghost" 
                              className="text-[#6A1B9A] hover:text-[#9C27B0] p-0 h-auto"
                            >
                              Acknowledge
                            </Button>
                          ) : alert.acknowledgedBy ? (
                            <span className="text-[#616161]">
                              Acknowledged by {alert.acknowledgedBy}
                            </span>
                          ) : (
                            <span className="text-[#616161]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
