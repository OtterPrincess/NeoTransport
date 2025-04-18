import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTimeAgo } from "@/lib/utils";
import type { Alert } from "@shared/schema";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface LiveNotificationsProps {
  alerts: Alert[];
}

export const LiveNotifications: React.FC<LiveNotificationsProps> = ({ alerts }) => {
  const queryClient = useQueryClient();
  
  // Only show active alerts that haven't been acknowledged
  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  
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
  
  const handleDismiss = async (alertId: number) => {
    try {
      await apiRequest('POST', `/api/alerts/${alertId}/resolve`, {});
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/units'] });
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };
  
  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'temperature':
        return {
          border: 'border-[#E53935]',
          bg: 'bg-[#E53935]/5',
        };
      case 'battery':
        return {
          border: 'border-[#FFA000]',
          bg: 'bg-[#FFA000]/5',
        };
      case 'vibration':
        return {
          border: 'border-[#FFA000]',
          bg: 'bg-[#FFA000]/5',
        };
      case 'maintenance':
        return {
          border: 'border-[#BDBDBD]',
          bg: 'bg-[#BDBDBD]/5',
        };
      default:
        return {
          border: 'border-[#BDBDBD]',
          bg: 'bg-[#BDBDBD]/5',
        };
    }
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3 text-[#662C6C]">Live Notifications</h3>
        
        {activeAlerts.length === 0 ? (
          <div className="text-center py-4 text-[#616161]">
            No active notifications
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map((alert) => {
              const style = getAlertStyle(alert.alertType);
              return (
                <div 
                  key={alert.id} 
                  className={`border-l-4 ${style.border} p-3 ${style.bg}`}
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{alert.alertType.charAt(0).toUpperCase() + alert.alertType.slice(1)} {alert.alertType === 'maintenance' ? 'Reminder' : 'Alert'}</span>
                    <span className="text-xs text-[#616161]">{getTimeAgo(alert.timestamp)}</span>
                  </div>
                  <p className="text-sm mt-1">{alert.message} {alert.value ? `(${alert.value})` : ''}</p>
                  <div className="mt-2 flex space-x-2">
                    <Button 
                      variant="default" 
                      className="text-xs bg-[#6A1B9A] text-white px-2 py-1 h-auto"
                      onClick={() => handleAcknowledge(alert.id)}
                    >
                      Acknowledge
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-xs border border-gray-300 px-2 py-1 h-auto"
                      onClick={() => handleDismiss(alert.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveNotifications;
