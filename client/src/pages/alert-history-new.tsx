import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/dashboard/header";
import TabNavigation from "@/components/dashboard/tab-navigation";
import Footer from "@/components/dashboard/footer";
import { formatDate } from "@/lib/utils";
import type { Alert, Unit } from "@shared/schema";

export default function AlertHistoryNew() {
  const [unitFilter, setUnitFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all alerts
  const { data: alerts = [], isLoading: isLoadingAlerts } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
    refetchInterval: 30000,
  });

  // Fetch all units for filtering
  const { data: units = [], isLoading: isLoadingUnits } = useQuery<Unit[]>({
    queryKey: ['/api/units'],
  });

  // Apply filters
  const filteredAlerts = alerts.filter(alert => {
    if (unitFilter !== "all" && alert.unitId.toString() !== unitFilter) return false;
    if (statusFilter !== "all" && alert.status !== statusFilter) return false;
    return true;
  });

  // Sort alerts by timestamp (most recent first)
  const sortedAlerts = [...filteredAlerts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Find unit name by ID
  const getUnitName = (unitId: number): string => {
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.unitId : `Unit ${unitId}`;
  };

  // Get alert type display
  const getAlertTypeDisplay = (type: string): string => {
    switch (type) {
      case 'temperature': return 'Temperature';
      case 'vibration': return 'Vibration';
      case 'battery': return 'Battery';
      case 'maintenance': return 'Maintenance';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Acknowledge alert mutation
  const acknowledgeMutation = useMutation({
    mutationFn: async (alertId: number) => {
      return apiRequest('POST', `/api/alerts/${alertId}/acknowledge`, {
        acknowledgedBy: user?.username || 'Unknown User'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({ title: "Alert acknowledged successfully" });
    },
    onError: () => {
      toast({ title: "Failed to acknowledge alert", variant: "destructive" });
    }
  });

  // Resolve alert mutation
  const resolveMutation = useMutation({
    mutationFn: async (alertId: number) => {
      return apiRequest('POST', `/api/alerts/${alertId}/resolve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({ title: "Alert resolved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to resolve alert", variant: "destructive" });
    }
  });

  const handleExport = () => {
    const headers = ["Time", "Unit", "Event", "Value", "Status"];
    const csvContent = [
      headers.join(","),
      ...sortedAlerts.map(alert => [
        `"${formatDate(alert.timestamp)}"`,
        `"${getUnitName(alert.unitId)}"`,
        `"${getAlertTypeDisplay(alert.alertType)}"`,
        `"${alert.value || 'N/A'}"`,
        `"${alert.status}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nestara-alerts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-6 py-8 flex-grow">
        {/* Header with Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Alert History</h1>
            <p className="text-slate-600">Monitor and track all system notifications</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-6 lg:mt-0">
            <div className="bg-white rounded-lg px-4 py-2 border border-slate-200 shadow-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-slate-900">
                  {alerts.filter(a => a.status === 'active').length} Active
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 border border-slate-200 shadow-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-slate-900">
                  {alerts.filter(a => a.status === 'resolved').length} Resolved
                </span>
              </div>
            </div>
            <Button
              onClick={handleExport}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <Card className="mb-6 shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Filter by Unit</label>
                <Select value={unitFilter} onValueChange={setUnitFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Units" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Units</SelectItem>
                    {units.map(unit => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>{unit.unitId}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Filter by Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-0">
            {isLoadingAlerts || isLoadingUnits ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading alerts...</p>
              </div>
            ) : sortedAlerts.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-600 text-lg font-medium">No alerts found</p>
                <p className="text-slate-500">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {sortedAlerts.map((alert, index) => (
                  <div key={alert.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant={alert.status === 'active' ? 'destructive' : alert.status === 'acknowledged' ? 'secondary' : 'default'}>
                            {alert.status}
                          </Badge>
                          <span className="text-sm font-medium text-slate-900">{getUnitName(alert.unitId)}</span>
                          <span className="text-sm text-slate-500">{formatDate(alert.timestamp)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${
                            alert.alertType === 'temperature' ? 'bg-red-500' :
                            alert.alertType === 'vibration' ? 'bg-amber-500' :
                            alert.alertType === 'battery' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}></div>
                          <h3 className="text-lg font-semibold text-slate-900">{getAlertTypeDisplay(alert.alertType)} Alert</h3>
                        </div>
                        
                        {alert.value && (
                          <p className="text-slate-600">Value: <span className="font-medium">{alert.value}</span></p>
                        )}
                        
                        {alert.acknowledgedBy && (
                          <p className="text-sm text-slate-500 mt-1">Acknowledged by {alert.acknowledgedBy}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {alert.status === 'active' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => acknowledgeMutation.mutate(alert.id)}
                              disabled={acknowledgeMutation.isPending}
                            >
                              Acknowledge
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => resolveMutation.mutate(alert.id)}
                              disabled={resolveMutation.isPending}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Resolve
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}