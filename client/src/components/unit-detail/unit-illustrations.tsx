import React from 'react';
import { getBedIllustration } from '@/components/dashboard/bed-illustrations';

// Create the main wrapper component
export const UnitIllustration: React.FC<{ 
  unitId: string; 
  status?: string;
}> = ({ unitId, status = "normal" }) => {
  // Check if this is a transport unit (only Units with "Transport" in room are transport)
  const isTransport = unitId.toLowerCase().includes('unit') && 
                     (unitId.toLowerCase().includes('air') || 
                      unitId.toLowerCase().includes('transport'));
  
  if (isTransport) {
    // Check if it's specifically an air transport unit
    const isAirTransport = unitId.toLowerCase().includes('air');
    return <TransportUnitIllustration status={status} isAir={isAirTransport} />;
  } else {
    // Extract bed number from the bed ID or unit ID
    const bedMatch = unitId.match(/Bed\s*(\d+)/i) || unitId.match(/(\d+)/);
    const bedNumber = bedMatch ? parseInt(bedMatch[1], 10) : 1;
    
    return <NICUBedIllustration bedNumber={bedNumber} status={status} />;
  }
};

// Transport Unit Illustration Component
const TransportUnitIllustration: React.FC<{ status?: string; isAir?: boolean }> = ({ status = "normal", isAir = false }) => {
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

  if (isAir) {
    // Air Transport Unit Illustration
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
        
        {/* Helicopter Blades */}
        <line x1="10" y1="15" x2="110" y2="15" stroke="#616161" strokeWidth="2" />
        <circle cx="60" cy="15" r="3" fill="#616161" />
        
        {/* Transparent Dome */}
        <path 
          d="M20 40 Q20 25 60 25 Q100 25 100 40" 
          fill="rgba(255, 255, 255, 0.5)" 
          stroke="#9E9E9E" 
          strokeWidth="1" 
        />
        
        {/* Landing Skids instead of wheels */}
        <rect x="20" y="85" width="25" height="4" rx="2" fill="#616161" />
        <rect x="75" y="85" width="25" height="4" rx="2" fill="#616161" />
        
        {/* Stabilizers */}
        <line x1="20" y1="85" x2="15" y2="65" stroke="#616161" strokeWidth="2" />
        <line x1="45" y1="85" x2="50" y2="65" stroke="#616161" strokeWidth="2" />
        <line x1="75" y1="85" x2="70" y2="65" stroke="#616161" strokeWidth="2" />
        <line x1="100" y1="85" x2="105" y2="65" stroke="#616161" strokeWidth="2" />
        
        {/* Monitoring Equipment */}
        <rect x="20" y="40" width="25" height="15" rx="2" fill={colors.monitor} stroke="#616161" strokeWidth="1" />
        <line x1="25" y1="45" x2="40" y2="45" stroke="#616161" strokeWidth="1" />
        <line x1="25" y1="50" x2="35" y2="50" stroke="#616161" strokeWidth="1" />
        
        {/* Status Indicator */}
        <circle cx="95" cy="45" r="5" fill={colors.accent} />
        
        {/* Text Label: "AIR TRANSPORT" */}
        <text x="60" y="65" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#616161" textAnchor="middle">
          AIR TRANSPORT
        </text>
      </svg>
    );
  } else {
    // Ground Transport Unit Illustration
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
  }
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