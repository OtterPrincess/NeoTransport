import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Alert } from "@shared/schema";

interface AlertHistoryProps {
  alerts: Alert[];
}

export const AlertHistory: React.FC<AlertHistoryProps> = ({ alerts }) => {
  const queryClient = useQueryClient();
  
  const handleAcknowledge = async (alertId: number) => {
    try {
      await apiRequest('POST', `/api/alerts/${alertId}/acknowledge`, {
        acknowledgedBy: 'Current User' // In a real app, this would be the authenticated user
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/units'] });
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-[#E53935] text-white";
      case 'acknowledged':
        return "bg-[#FFA000] text-white";
      default:
        return "bg-gray-200 text-[#616161]";
    }
  };
  
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
  
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Alert History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider">Time</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider">Event</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider">Value</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider">Status</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-sm text-[#616161]">
                    No alerts found
                  </td>
                </tr>
              ) : (
                alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#212121]">
                      {formatTime(alert.timestamp)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {getAlertTypeDisplay(alert.alertType)}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                      alert.alertType === 'temperature' && alert.value && parseFloat(alert.value) > 38.5 
                        ? 'text-[#E53935]' 
                        : alert.alertType === 'battery' && alert.value && parseInt(alert.value) < 30
                          ? 'text-[#FFA000]'
                          : ''
                    }`}>
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
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      ) : (
                        <span className="text-[#616161]">
                          {alert.acknowledgedBy ? `Acknowledged by ${alert.acknowledgedBy}` : 
                            alert.status === 'resolved' ? 'Auto-resolved' : '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <Button variant="link" className="text-[#6A1B9A] hover:text-[#9C27B0] text-sm font-medium p-0">
            View All History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertHistory;
