import React from 'react';
import { getBedIllustration } from '@/components/dashboard/bed-illustrations';

// Create the main wrapper component
export const UnitIllustration: React.FC<{ 
  unitId: string; 
  status?: string;
}> = ({ unitId, status = "normal" }) => {
  // Check if this is a transport unit or bed unit
  const isTransport = unitId.toLowerCase().includes('unit');
  
  if (isTransport) {
    return <TransportUnitIllustration status={status} />;
  } else {
    // Extract bed number from the bed ID
    const bedMatch = unitId.match(/Bed\s*(\d+)/i);
    const bedNumber = bedMatch ? parseInt(bedMatch[1], 10) : 0;
    
    return <NICUBedIllustration bedNumber={bedNumber} status={status} />;
  }
};

// Transport Unit Illustration Component
const TransportUnitIllustration: React.FC<{ status?: string }> = ({ status = "normal" }) => {
  // Colors based on status
  const getColors = () => {
    switch (status) {
      case "alert":
        return {
          base: "#FFEBEE",
          accent: "#E53935",
          monitor: "#FFCDD2"
        };
      case "warning":
        return {
          base: "#FFF8E1",
          accent: "#FFA000",
          monitor: "#FFECB3"
        };
      case "offline":
        return {
          base: "#F5F5F5",
          accent: "#BDBDBD",
          monitor: "#E0E0E0"
        };
      default: // normal
        return {
          base: "#E8F5E9",
          accent: "#66BB6A",
          monitor: "#C8E6C9"
        };
    }
  };

  const colors = getColors();

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Base Transport Incubator */}
      <rect x="10" y="30" width="100" height="50" rx="4" fill={colors.base} stroke="#616161" strokeWidth="2" />
      
      {/* Top Dome */}
      <path 
        d="M10 40 Q10 20 60 20 Q110 20 110 40" 
        fill="none" 
        stroke="#616161" 
        strokeWidth="2" 
      />
      
      {/* Transparent Dome */}
      <path 
        d="M20 40 Q20 25 60 25 Q100 25 100 40" 
        fill="rgba(255, 255, 255, 0.5)" 
        stroke="#9E9E9E" 
        strokeWidth="1" 
      />
      
      {/* Wheels */}
      <circle cx="30" cy="85" r="5" fill="#616161" />
      <circle cx="90" cy="85" r="5" fill="#616161" />
      
      {/* Handle */}
      <rect x="10" y="35" width="5" height="10" rx="2" fill="#616161" />
      <rect x="105" y="35" width="5" height="10" rx="2" fill="#616161" />
      
      {/* Monitoring Equipment */}
      <rect x="20" y="40" width="25" height="15" rx="2" fill={colors.monitor} stroke="#616161" strokeWidth="1" />
      <line x1="25" y1="45" x2="40" y2="45" stroke="#616161" strokeWidth="1" />
      <line x1="25" y1="50" x2="35" y2="50" stroke="#616161" strokeWidth="1" />
      
      {/* Status Indicator */}
      <circle cx="95" cy="45" r="5" fill={colors.accent} />
      
      {/* Text Label: "TRANSPORT" */}
      <text x="60" y="65" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#616161" textAnchor="middle">
        TRANSPORT
      </text>
    </svg>
  );
};

// NICU Bed Illustration Component
const NICUBedIllustration: React.FC<{ bedNumber: number; status?: string }> = ({ bedNumber, status = "normal" }) => {
  return getBedIllustration(`Bed ${bedNumber}`, status);
};

// Function to get the appropriate unit illustration
export const getUnitIllustration = (unitId: string, status: string = "normal"): React.ReactNode => {
  return <UnitIllustration unitId={unitId} status={status} />;
};

export default getUnitIllustration;