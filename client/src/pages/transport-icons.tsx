import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function TransportIcons() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#6A1B9A]">Emergency Transport Partners</h1>
        <Link href="/" className="px-4 py-2 bg-[#F3E5F5] hover:bg-[#E1BEE7] text-[#6A1B9A] rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Dashboard
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Emergency Department Transport Partners</CardTitle>
          <CardDescription>
            Our emergency transport partners work closely with triage care to ensure 
            safe and efficient neonatal transport across all environments. 
            Contact information and specialized equipment details available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group">
              <div className="p-6 border rounded-md flex flex-col items-center">
                <h3 className="font-medium mb-4">Air Transport</h3>
                <AirTransportIcon size="large" />
                <p className="mt-4 text-sm text-[#6A1B9A] font-medium">Helicopter/Aircraft</p>
              </div>
              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white p-4 shadow-lg rounded-md border border-[#E1BEE7] w-full h-full">
                  <h4 className="font-medium text-[#6A1B9A] mb-2">Air Transport</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Used for all aerial medical transports</li>
                    <li>Monitors altitude changes and cabin pressure</li>
                    <li>Tracks rotor/engine vibration patterns</li>
                    <li>Specialized equipment for aerial conditions</li>
                    <li>Features emergency landing protocols</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="p-6 border rounded-md flex flex-col items-center">
                <h3 className="font-medium mb-4">Ground Transport</h3>
                <GroundTransportIcon size="large" />
                <p className="mt-4 text-sm text-[#6A1B9A] font-medium">Ambulance/Vehicle</p>
              </div>
              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white p-4 shadow-lg rounded-md border border-[#E1BEE7] w-full h-full">
                  <h4 className="font-medium text-[#6A1B9A] mb-2">Ground Transport</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Used for all road-based transports</li>
                    <li>Road condition and speed tracking</li>
                    <li>Specialized shock absorption monitoring</li>
                    <li>GPS location and route optimization</li>
                    <li>Traffic-aware journey planning</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="p-6 border rounded-md flex flex-col items-center">
                <h3 className="font-medium mb-4">Room-to-Room</h3>
                <RoomTransportIcon size="large" />
                <p className="mt-4 text-sm text-[#6A1B9A] font-medium">Internal Transfer</p>
              </div>
              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white p-4 shadow-lg rounded-md border border-[#E1BEE7] w-full h-full">
                  <h4 className="font-medium text-[#6A1B9A] mb-2">Room-to-Room</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Used for all internal facility transports</li>
                    <li>Tracks movement between hospital rooms</li>
                    <li>Environmental change monitoring</li>
                    <li>Elevator and corridor-specific metrics</li>
                    <li>Elapsed transport time tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-[#F3E5F5] rounded-md">
            <p className="text-sm text-center text-[#6A1B9A]">
              <strong>Hover over each icon</strong> to see detailed information about its usage and features.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Transport Partner Information Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Transport Partner Network</CardTitle>
          <CardDescription>
            Our transport partner network includes certified healthcare facilities with specialized neonatal transport capabilities.
            Contact information is available to authorized personnel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-md hover:shadow-md transition-shadow">
              <h3 className="font-medium text-[#6A1B9A]">Pediatric Specialty Center</h3>
              <p className="text-sm text-gray-600 mt-1">Specialized Neonatal Care Transport</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-gray-500">Available 24/7</span>
              </div>
              <p className="text-sm mt-2">
                <strong>Transport Types:</strong> Air, Ground, Intrahospital
              </p>
            </div>
            
            <div className="p-4 border rounded-md hover:shadow-md transition-shadow">
              <h3 className="font-medium text-[#6A1B9A]">Regional Medical Center</h3>
              <p className="text-sm text-gray-600 mt-1">Neonatal Emergency Response Team</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-gray-500">Available 24/7</span>
              </div>
              <p className="text-sm mt-2">
                <strong>Transport Types:</strong> Ground, Intrahospital
              </p>
            </div>
            
            <div className="p-4 border rounded-md hover:shadow-md transition-shadow">
              <h3 className="font-medium text-[#6A1B9A]">Maternal-Fetal Care Institute</h3>
              <p className="text-sm text-gray-600 mt-1">Maternal-Fetal Transport Services</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-gray-500">Available 24/7</span>
              </div>
              <p className="text-sm mt-2">
                <strong>Transport Types:</strong> Air, Ground
              </p>
            </div>
            
            <div className="p-4 border rounded-md hover:shadow-md transition-shadow">
              <h3 className="font-medium text-[#6A1B9A]">AeroMedical Transport Services</h3>
              <p className="text-sm text-gray-600 mt-1">Critical Care Air Transport</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-gray-500">Available 24/7</span>
              </div>
              <p className="text-sm mt-2">
                <strong>Transport Types:</strong> Air (Fixed-wing & Rotary)
              </p>
            </div>
            
            <div className="p-4 border rounded-md hover:shadow-md transition-shadow">
              <h3 className="font-medium text-[#6A1B9A]">Emergency Medical Transport</h3>
              <p className="text-sm text-gray-600 mt-1">Regional Emergency Services</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-gray-500">Available 24/7</span>
              </div>
              <p className="text-sm mt-2">
                <strong>Transport Types:</strong> Ground
              </p>
            </div>
            
            <div className="p-4 border rounded-md hover:shadow-md transition-shadow">
              <h3 className="font-medium text-[#6A1B9A]">University Medical Network</h3>
              <p className="text-sm text-gray-600 mt-1">Neonatal Transport Program</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-gray-500">Available 24/7</span>
              </div>
              <p className="text-sm mt-2">
                <strong>Transport Types:</strong> Ground, Intrahospital
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Icon Showcase Component
const IconShowcase: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({ title, description, icon }) => {
  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex justify-center">
        {icon}
      </div>
    </div>
  );
};

// Air Transport Icon (Helicopter/Plane)
const AirTransportIcon: React.FC<{ size: 'small' | 'medium' | 'large' }> = ({ size }) => {
  const dimensions = {
    small: { width: 40, height: 40 },
    medium: { width: 80, height: 80 },
    large: { width: 120, height: 120 }
  };
  
  const { width, height } = dimensions[size];
  
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
    </svg>
  );
};

// Ground Transport Icon (Ambulance)
const GroundTransportIcon: React.FC<{ size: 'small' | 'medium' | 'large' }> = ({ size }) => {
  const dimensions = {
    small: { width: 40, height: 40 },
    medium: { width: 80, height: 80 },
    large: { width: 120, height: 120 }
  };
  
  const { width, height } = dimensions[size];
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ambulance body */}
      <rect x="15" y="50" width="90" height="35" rx="5" fill="#E1BEE7" stroke="#6A1B9A" strokeWidth="2" />
      <rect x="15" y="65" width="30" height="20" fill="#E1BEE7" stroke="#6A1B9A" strokeWidth="2" />
      
      {/* Windows */}
      <rect x="20" y="55" width="20" height="10" rx="2" fill="#E8EAF6" stroke="#6A1B9A" strokeWidth="1" />
      
      {/* Wheels */}
      <circle cx="35" cy="85" r="8" fill="#616161" stroke="#6A1B9A" strokeWidth="1" />
      <circle cx="85" cy="85" r="8" fill="#616161" stroke="#6A1B9A" strokeWidth="1" />
      <circle cx="35" cy="85" r="3" fill="#F5F5F5" />
      <circle cx="85" cy="85" r="3" fill="#F5F5F5" />
      
      {/* Emergency lights */}
      <rect x="95" y="45" width="5" height="5" rx="2.5" fill="#D81B60" />
      
      {/* Medical cross */}
      <rect x="65" y="55" width="20" height="20" rx="2" fill="#F5F5F5" stroke="#6A1B9A" strokeWidth="1" />
      <rect x="70" y="60" width="10" height="10" fill="#D81B60" />
      <rect x="74" y="56" width="2" height="18" fill="#D81B60" />
      <rect x="66" y="64" width="18" height="2" fill="#D81B60" />
    </svg>
  );
};

// Room-to-Room Transport Icon
const RoomTransportIcon: React.FC<{ size: 'small' | 'medium' | 'large' }> = ({ size }) => {
  const dimensions = {
    small: { width: 40, height: 40 },
    medium: { width: 80, height: 80 },
    large: { width: 120, height: 120 }
  };
  
  const { width, height } = dimensions[size];
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Room 1 */}
      <rect x="10" y="40" width="40" height="50" fill="#E1BEE7" stroke="#6A1B9A" strokeWidth="2" />
      <rect x="20" y="70" width="20" height="10" fill="#F5F5F5" stroke="#6A1B9A" strokeWidth="1" /> {/* Bed */}
      
      {/* Room 2 */}
      <rect x="70" y="40" width="40" height="50" fill="#E1BEE7" stroke="#6A1B9A" strokeWidth="2" />
      <rect x="80" y="70" width="20" height="10" fill="#F5F5F5" stroke="#6A1B9A" strokeWidth="1" /> {/* Bed */}
      
      {/* Connecting doorway */}
      <rect x="50" y="55" width="20" height="20" fill="#F5F5F5" stroke="#6A1B9A" strokeWidth="2" />
      <path d="M50 55 L70 75" stroke="#6A1B9A" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M50 75 L70 55" stroke="#6A1B9A" strokeWidth="1" strokeDasharray="2 2" />
      
      {/* Transport unit */}
      <rect x="45" y="65" width="30" height="15" rx="3" fill="#CE93D8" stroke="#6A1B9A" strokeWidth="1" />
      <circle cx="50" cy="80" r="2" fill="#616161" />
      <circle cx="70" cy="80" r="2" fill="#616161" />
      
      {/* Directional arrow */}
      <path d="M40 50 L80 50" stroke="#6A1B9A" strokeWidth="2" strokeLinecap="round" />
      <path d="M75 45 L80 50 L75 55" fill="none" stroke="#6A1B9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};