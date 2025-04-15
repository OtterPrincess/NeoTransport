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
  | "info";

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
    default:
      return <AlertCircle {...iconProps} />;
  }
};

export default Icon;
