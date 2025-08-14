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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Filter Units</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="relative w-full group/button overflow-hidden rounded-md">
              <div className="absolute inset-0 bg-gradient-to-r from-[#9C27B0]/0 via-[#9C27B0]/10 to-[#C2185B]/0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <Button 
                variant="default" 
                className="bg-[#6A1B9A] text-white w-full relative z-10 transition-all duration-300"
                onClick={handleApplyFilters}
              >
                <Icon name="filter" size={16} className="mr-1" />
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;