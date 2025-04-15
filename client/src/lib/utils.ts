import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function formatTime(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function formatShortDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getTimeAgo(date: Date | string | number): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
}

export function getStatusColor(status: string): {
  textColor: string;
  bgColor: string;
  borderColor: string;
} {
  switch(status.toLowerCase()) {
    case 'normal':
      return {
        textColor: 'text-safe',
        bgColor: 'bg-safe',
        borderColor: 'border-safe'
      };
    case 'warning':
      return {
        textColor: 'text-warning',
        bgColor: 'bg-warning',
        borderColor: 'border-warning'
      };
    case 'alert':
      return {
        textColor: 'text-alert',
        bgColor: 'bg-alert',
        borderColor: 'border-alert'
      };
    case 'offline':
    default:
      return {
        textColor: 'text-offline',
        bgColor: 'bg-offline',
        borderColor: 'border-offline'
      };
  }
}

export function getTemperatureStatusColor(temp: number): string {
  if (temp > 38.5) return 'text-alert';
  if (temp > 37.5 || temp < 36.0) return 'text-warning';
  return 'text-safe';
}

export function getBatteryStatusColor(level: number): string {
  if (level < 20) return 'text-alert';
  if (level < 30) return 'text-warning';
  return 'text-safe';
}

export function getTelemetryStatusText(
  telemetry: { internalTemp?: number | null, surfaceTemp?: number | null, vibration?: number | null, batteryLevel?: number | null } | null | undefined
): "normal" | "warning" | "alert" | "offline" {
  if (!telemetry) return "offline";
  
  // Check internal temperature
  if (telemetry.internalTemp !== undefined && telemetry.internalTemp !== null) {
    if (telemetry.internalTemp > 38.5) return "alert";
    if (telemetry.internalTemp > 37.5 || telemetry.internalTemp < 36.0) return "warning";
  }
  
  // Check surface temperature
  if (telemetry.surfaceTemp !== undefined && telemetry.surfaceTemp !== null) {
    if (telemetry.surfaceTemp > 37.5) return "alert";
    if (telemetry.surfaceTemp > 37.0 || telemetry.surfaceTemp < 35.5) return "warning";
  }
  
  // Check battery level
  if (telemetry.batteryLevel !== undefined && telemetry.batteryLevel !== null) {
    if (telemetry.batteryLevel < 20) return "alert";
    if (telemetry.batteryLevel < 30) return "warning";
  }
  
  return "normal";
}
