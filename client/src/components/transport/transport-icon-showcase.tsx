import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomToRoomIcon, GroundTransportIcon, AerotransportIcon } from './transport-icons';

const TransportIconShowcase: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-[#662C6C] mb-6">Transport Icons</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#662C6C]">Room to Room</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="p-4 bg-[#F3E5F5] rounded-lg mb-4 flex items-center justify-center">
              <RoomToRoomIcon size={100} />
            </div>
            <p className="text-sm text-center text-gray-600">
              For patient transfers between rooms within the same facility
            </p>
            <div className="mt-4 flex space-x-4">
              <RoomToRoomIcon size={24} />
              <RoomToRoomIcon size={32} />
              <RoomToRoomIcon size={48} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#662C6C]">Ground Transport</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="p-4 bg-[#F3E5F5] rounded-lg mb-4 flex items-center justify-center">
              <GroundTransportIcon size={100} />
            </div>
            <p className="text-sm text-center text-gray-600">
              For ambulance and vehicle-based neonatal transport
            </p>
            <div className="mt-4 flex space-x-4">
              <GroundTransportIcon size={24} />
              <GroundTransportIcon size={32} />
              <GroundTransportIcon size={48} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#662C6C]">Aerotransport</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="p-4 bg-[#F3E5F5] rounded-lg mb-4 flex items-center justify-center">
              <AerotransportIcon size={100} />
            </div>
            <p className="text-sm text-center text-gray-600">
              For helicopter and aircraft-based neonatal transport
            </p>
            <div className="mt-4 flex space-x-4">
              <AerotransportIcon size={24} />
              <AerotransportIcon size={32} />
              <AerotransportIcon size={48} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-[#662C6C] mb-4">Usage Example</h3>
        <Card className="p-4">
          <code className="block bg-gray-100 p-4 rounded-md text-sm overflow-x-auto whitespace-pre">
{`// Import the icons
import { 
  RoomToRoomIcon, 
  GroundTransportIcon, 
  AerotransportIcon, 
  getTransportIcon 
} from '@/components/transport/transport-icons';

// Use individual icons
<RoomToRoomIcon size={40} />
<GroundTransportIcon size={40} />
<AerotransportIcon size={40} />

// Or use the helper function
<div>
  {getTransportIcon('room-to-room', 40)}
  {getTransportIcon('ground', 40)}
  {getTransportIcon('air', 40)}
</div>`}
          </code>
        </Card>
      </div>
    </div>
  );
};

export default TransportIconShowcase;