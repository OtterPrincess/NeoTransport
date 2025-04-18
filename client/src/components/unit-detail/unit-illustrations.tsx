import React from 'react';
import { getBedIllustration } from '@/components/dashboard/bed-illustrations';

// Define the AirTransportIcon component (modified from transport-icons.tsx)
const AirTransportIcon: React.FC<{ size?: 'small' | 'medium' | 'large'; status?: string }> = ({ 
  size = 'medium', 
  status = 'normal' 
}) => {
  const dimensions = {
    small: { width: 50, height: 50 },
    medium: { width: 100, height: 100 },
    large: { width: 150, height: 150 }
  };
  
  const { width, height } = dimensions[size];
  
  // Colors based on status
  const getColors = () => {
    switch (status) {
      case "alert":
        return {
          base: "#FFEBEE",
          accent: "#E53935"
        };
      case "warning":
        return {
          base: "#FFF8E1",
          accent: "#FFA000"
        };
      case "offline":
        return {
          base: "#F5F5F5",
          accent: "#BDBDBD"
        };
      default: // normal
        return {
          base: "#E8F5E9",
          accent: "#66BB6A"
        };
    }
  };

  const colors = getColors();
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base helicopter body */}
      <rect x="30" y="50" width="60" height="30" rx="10" fill="#E1BEE7" stroke="#6A1B9A" strokeWidth="2" />
      
      {/* Helicopter rotors */}
      <line x1="10" y1="40" x2="110" y2="40" stroke="#6A1B9A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="40" r="5" fill="#6A1B9A" />
      <line x1="60" y1="40" x2="60" y2="50" stroke="#6A1B9A" strokeWidth="2" />
      
      {/* Helicopter skids */}
      <rect x="35" y="80" width="20" height="3" rx="1.5" fill="#6A1B9A" />
      <rect x="65" y="80" width="20" height="3" rx="1.5" fill="#6A1B9A" />
      <line x1="40" y1="80" x2="40" y2="70" stroke="#6A1B9A" strokeWidth="2" />
      <line x1="50" y1="80" x2="50" y2="70" stroke="#6A1B9A" strokeWidth="2" />
      <line x1="70" y1="80" x2="70" y2="70" stroke="#6A1B9A" strokeWidth="2" />
      <line x1="80" y1="80" x2="80" y2="70" stroke="#6A1B9A" strokeWidth="2" />
      
      {/* Tail & tail rotor */}
      <path d="M90 65 L105 55 L105 75 L90 65" fill="#E1BEE7" stroke="#6A1B9A" strokeWidth="2" />
      <circle cx="105" cy="65" r="4" fill="#E1BEE7" stroke="#6A1B9A" strokeWidth="2" />
      
      {/* Medical cross */}
      <rect x="50" y="55" width="20" height="20" rx="2" fill="#F5F5F5" stroke="#6A1B9A" strokeWidth="1" />
      <rect x="55" y="60" width="10" height="10" fill="#D81B60" />
      <rect x="59" y="56" width="2" height="18" fill="#D81B60" />
      <rect x="51" y="64" width="18" height="2" fill="#D81B60" />
      
      {/* Status indicator */}
      <circle cx="90" cy="60" r="5" fill={colors.accent} />
    </svg>
  );
};

// Create the main wrapper component
export const UnitIllustration: React.FC<{ 
  unitId: string; 
  status?: string;
}> = ({ unitId, status = "normal" }) => {
  // Check if this is Unit 5 (Air Transport)
  if (unitId === "Unit #5") {
    // Make the transport icon larger for better visibility
    return (
      <div className="flex items-center justify-center flex-col">
        <div className="h-32 flex items-center justify-center">
          <AirTransportIcon size="large" status={status} />
        </div>
        <div className="text-xs font-semibold text-[#6A1B9A]">Aeromedical Transfer</div>
      </div>
    );
  }
  
  // Otherwise, check if it has transport in the name
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

// Transport Unit Illustration Component (Original fallback version)
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
export function getUnitIllustration(unitId: string, status: string = "normal"): React.ReactNode {
  return <UnitIllustration unitId={unitId} status={status} />;
}

// Export component for use in other files
export default UnitIllustration;