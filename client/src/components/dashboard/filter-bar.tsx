import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { ROOMS, ROOM_BEDS, STATUS_OPTIONS } from "@/lib/constants";

interface FilterBarProps {
  onApplyFilters: (filters: { room: string; unitId: string; status: string; bed: string }) => void;
  units: Array<{ id: number; unitId: string }>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onApplyFilters,
  units
}) => {
  const [room, setRoom] = useState("all");
  const [unitId, setUnitId] = useState("all");
  const [status, setStatus] = useState("all");
  const [bed, setBed] = useState("all");
  const [availableBeds, setAvailableBeds] = useState<string[]>([]);

  // Update available beds when room changes
  useEffect(() => {
    if (room && room !== "all" && ROOM_BEDS[room as keyof typeof ROOM_BEDS]) {
      setAvailableBeds(ROOM_BEDS[room as keyof typeof ROOM_BEDS]);
    } else {
      setAvailableBeds([]);
    }
  }, [room]);

  const handleApplyFilters = () => {
    // Convert "all" values to empty strings for filter logic
    const processedRoom = room === "all" ? "" : room;
    const processedUnitId = unitId === "all" ? "" : unitId;
    const processedStatus = status === "all" ? "" : status;
    const processedBed = bed === "all" ? "" : bed;
    
    onApplyFilters({ 
      room: processedRoom, 
      unitId: processedUnitId, 
      status: processedStatus,
      bed: processedBed
    });
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="room-filter" className="text-sm font-medium text-[#616161] mb-1">Room</Label>
            <Select value={room} onValueChange={setRoom}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Rooms" />
              </SelectTrigger>
              <SelectContent>
                {ROOMS.map((option) => (
                  <SelectItem key={`room-${option.value}`} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Bed filter - visible only when a room is selected */}
          {room !== "all" && room !== "Transport" && (
            <div>
              <Label htmlFor="bed-filter" className="text-sm font-medium text-[#616161] mb-1">Bed</Label>
              <Select value={bed} onValueChange={setBed}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Beds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Beds</SelectItem>
                  {availableBeds.map((bedOption) => (
                    <SelectItem key={`bed-${bedOption}`} value={bedOption}>{bedOption}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <Label htmlFor="unit-filter" className="text-sm font-medium text-[#616161] mb-1">Unit ID</Label>
            <Select value={unitId} onValueChange={setUnitId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all-units" value="all">All Units</SelectItem>
                {units.map((unit) => (
                  <SelectItem key={`unit-${unit.id}`} value={unit.unitId}>{unit.unitId}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status-filter" className="text-sm font-medium text-[#616161] mb-1">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={`status-${option.value}`} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              variant="default" 
              className="bg-[#6A1B9A] hover:bg-[#6A1B9A]/90 text-white w-full"
              onClick={handleApplyFilters}
            >
              <Icon name="filter" size={16} className="mr-1" />
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;