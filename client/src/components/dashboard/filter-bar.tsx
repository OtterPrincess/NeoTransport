import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { ROOMS, STATUS_OPTIONS } from "@/lib/constants";

interface FilterBarProps {
  onApplyFilters: (filters: { room: string; unitId: string; status: string }) => void;
  units: Array<{ id: number; unitId: string }>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onApplyFilters,
  units
}) => {
  const [room, setRoom] = useState("all");
  const [unitId, setUnitId] = useState("all");
  const [status, setStatus] = useState("all");

  const handleApplyFilters = () => {
    // Convert "all" values to empty strings for filter logic
    const processedRoom = room === "all" ? "" : room;
    const processedUnitId = unitId === "all" ? "" : unitId;
    const processedStatus = status === "all" ? "" : status;
    
    onApplyFilters({ 
      room: processedRoom, 
      unitId: processedUnitId, 
      status: processedStatus 
    });
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
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
