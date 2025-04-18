import React from 'react';

// Room to Room Transport Icon
export const RoomToRoomIcon: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 40 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="5" y="15" width="40" height="70" rx="2" stroke="#662C6C" strokeWidth="3" fill="none" />
      <rect x="55" y="15" width="40" height="70" rx="2" stroke="#662C6C" strokeWidth="3" fill="none" />
      
      {/* Door in first room */}
      <rect x="35" y="40" width="10" height="30" rx="1" stroke="#662C6C" strokeWidth="2" fill="none" />
      <circle cx="39" cy="55" r="2" fill="#662C6C" />
      
      {/* Door in second room */}
      <rect x="55" y="40" width="10" height="30" rx="1" stroke="#662C6C" strokeWidth="2" fill="none" />
      <circle cx="61" cy="55" r="2" fill="#662C6C" />
      
      {/* Arrows indicating movement */}
      <path d="M45 55H55" stroke="#662C6C" strokeWidth="3" strokeLinecap="round" />
      <path d="M52 50L57 55L52 60" stroke="#662C6C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Bed silhouette */}
      <rect x="15" y="40" width="15" height="25" rx="1" stroke="#662C6C" strokeWidth="2" fill="none" />
      <rect x="70" y="40" width="15" height="25" rx="1" stroke="#662C6C" strokeWidth="2" fill="none" />
      
      {/* Small bed wheels */}
      <circle cx="18" cy="65" r="2" fill="#662C6C" />
      <circle cx="27" cy="65" r="2" fill="#662C6C" />
      <circle cx="73" cy="65" r="2" fill="#662C6C" />
      <circle cx="82" cy="65" r="2" fill="#662C6C" />
    </svg>
  );
};

// Ground Transport Icon (Ambulance)
export const GroundTransportIcon: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 40 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ambulance body */}
      <rect x="10" y="30" width="60" height="30" fill="#662C6C" rx="3" />
      <rect x="70" y="35" width="20" height="25" fill="#662C6C" rx="2" />
      
      {/* Windows */}
      <rect x="15" y="35" width="12" height="10" fill="white" rx="1" />
      <rect x="32" y="35" width="12" height="10" fill="white" rx="1" />
      <rect x="49" y="35" width="12" height="10" fill="white" rx="1" />
      <rect x="75" y="40" width="10" height="10" fill="white" rx="1" />
      
      {/* Medical cross */}
      <rect x="56" y="45" width="10" height="10" fill="white" />
      <rect x="59" y="42" width="4" height="16" fill="white" />
      
      {/* Wheels */}
      <circle cx="25" cy="65" r="8" fill="none" stroke="#662C6C" strokeWidth="3" />
      <circle cx="25" cy="65" r="2" fill="#662C6C" />
      <circle cx="75" cy="65" r="8" fill="none" stroke="#662C6C" strokeWidth="3" />
      <circle cx="75" cy="65" r="2" fill="#662C6C" />
      
      {/* Front lights */}
      <rect x="5" y="40" width="5" height="5" fill="#FFA000" rx="1" />
      <rect x="5" y="50" width="5" height="5" fill="red" rx="1" />
      
      {/* Road */}
      <rect x="5" y="73" width="90" height="2" fill="#662C6C" />
      <rect x="15" y="73" width="10" height="2" fill="white" />
      <rect x="35" y="73" width="10" height="2" fill="white" />
      <rect x="55" y="73" width="10" height="2" fill="white" />
      <rect x="75" y="73" width="10" height="2" fill="white" />
    </svg>
  );
};

// Aerotransport Icon (Helicopter)
export const AerotransportIcon: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 40 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Main helicopter body */}
      <ellipse cx="50" cy="55" rx="25" ry="15" fill="#662C6C" />
      
      {/* Tail boom */}
      <path d="M75 55L90 48" stroke="#662C6C" strokeWidth="4" strokeLinecap="round" />
      <path d="M90 48L95 52" stroke="#662C6C" strokeWidth="3" strokeLinecap="round" />
      <path d="M90 48L92 43" stroke="#662C6C" strokeWidth="3" strokeLinecap="round" />
      
      {/* Main rotor */}
      <circle cx="50" cy="40" r="3" fill="#662C6C" />
      <path d="M50 40L85 35" stroke="#662C6C" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 40L15 35" stroke="#662C6C" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 40L55 15" stroke="#662C6C" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 40L45 15" stroke="#662C6C" strokeWidth="3" strokeLinecap="round" />
      
      {/* Windows */}
      <path d="M35 50C35 47.2386 37.2386 45 40 45H55C57.7614 45 60 47.2386 60 50V55H35V50Z" fill="white" />
      
      {/* Landing skids */}
      <path d="M35 65C35 65 30 70 25 70H65C65 70 70 70 75 65" stroke="#662C6C" strokeWidth="3" />
      <path d="M30 70V75" stroke="#662C6C" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 70V75" stroke="#662C6C" strokeWidth="3" strokeLinecap="round" />
      
      {/* Medical cross */}
      <rect x="46" y="57" width="8" height="8" fill="white" />
      <rect x="48" y="55" width="4" height="12" fill="white" />
    </svg>
  );
};

// Function to get transport icon by type
export const getTransportIcon = (type: string, size?: number, className?: string): React.ReactNode => {
  switch (type.toLowerCase()) {
    case 'room-to-room':
    case 'room':
      return <RoomToRoomIcon size={size} className={className} />;
    case 'ground':
    case 'ambulance':
      return <GroundTransportIcon size={size} className={className} />;
    case 'aerotransport':
    case 'air':
    case 'helicopter':
      return <AerotransportIcon size={size} className={className} />;
    default:
      return <GroundTransportIcon size={size} className={className} />;
  }
};