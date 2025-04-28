import React from "react";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  BellRing, 
  CheckCircle, 
  Clock, 
  Zap, 
  Thermometer, 
  Activity, 
  Battery, 
  X,
  RefreshCw,
  Upload,
  Settings,
  FileText,
  Layers,
  List,
  Filter,
  ArrowLeft,
  ExternalLink,
  Plus,
  Minus,
  AlertCircle
} from "lucide-react";

export type IconName = 
  | "alert"
  | "warning"
  | "success"
  | "time"
  | "battery"
  | "vibration"
  | "temperature"
  | "internalTemp"
  | "surfaceTemp"
  | "notification"
  | "offline"
  | "refresh"
  | "upload"
  | "settings"
  | "report"
  | "items"
  | "filter"
  | "list"
  | "back"
  | "teams"
  | "increase"
  | "decrease"
  | "info"
  | "search"
  | "arrow-right"
  | "refresh-cw"
  | "user"
  | "log-out"
  | "mobile";

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className, size = 24 }) => {
  const iconProps = {
    size,
    className: cn(className)
  };

  switch (name) {
    case "alert":
      return <AlertTriangle {...iconProps} />;
    case "warning":
      return <AlertTriangle {...iconProps} />;
    case "success":
      return <CheckCircle {...iconProps} />;
    case "time":
      return <Clock {...iconProps} />;
    case "battery":
      return <Battery {...iconProps} />;
    case "vibration":
      return <Activity {...iconProps} />;
    case "temperature":
    case "internalTemp":
      return <Thermometer {...iconProps} />;
    case "surfaceTemp":
      return <Zap {...iconProps} />;
    case "notification":
      return <BellRing {...iconProps} />;
    case "offline":
      return <X {...iconProps} />;
    case "refresh":
    case "refresh-cw":
      return <RefreshCw {...iconProps} />;
    case "upload":
      return <Upload {...iconProps} />;
    case "settings":
      return <Settings {...iconProps} />;
    case "report":
      return <FileText {...iconProps} />;
    case "items":
      return <Layers {...iconProps} />;
    case "list":
      return <List {...iconProps} />;
    case "filter":
      return <Filter {...iconProps} />;
    case "back":
      return <ArrowLeft {...iconProps} />;
    case "teams":
      return <ExternalLink {...iconProps} />;
    case "increase":
      return <Plus {...iconProps} />;
    case "decrease":
      return <Minus {...iconProps} />;
    case "info":
      return <AlertCircle {...iconProps} />;
    case "search":
      return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(className)}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
    case "arrow-right":
      return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(className)}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
    case "user":
      return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(className)}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "log-out":
      return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(className)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
    case "mobile":
      return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(className)}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
    default:
      return <AlertCircle {...iconProps} />;
  }
};

export default Icon;
