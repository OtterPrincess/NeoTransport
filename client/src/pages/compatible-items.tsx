import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Header from "@/components/dashboard/header";
import TabNavigation from "@/components/dashboard/tab-navigation";
import Footer from "@/components/dashboard/footer";
import Icon from "@/components/ui/icon";

interface CompatibleItem {
  id: string;
  name: string;
  category: string;
  thermalRating: string;
  compatibleUnits: string[];
  sku: string;
  notes: string;
}

// Sample items for the page - in a real app, this would come from an API
const compatibleItems: CompatibleItem[] = [
  // Medical Equipment
  {
    id: "1",
    name: "Portable Suction Unit",
    category: "Medical Equipment",
    thermalRating: "N/A",
    compatibleUnits: ["Unit #1", "Unit #2", "Unit #3", "Unit #4", "Unit #5"],
    sku: "PSU-101",
    notes: "For clearing airways in emergency en route situations"
  },
  {
    id: "2",
    name: "Integrated Vital Signs Monitor Clip-on",
    category: "Medical Equipment",
    thermalRating: "N/A",
    compatibleUnits: ["Unit #1", "Unit #2", "Unit #3"],
    sku: "VSM-202",
    notes: "Compact, unit-attachable monitor for heart rate, SpO2, and temperature"
  },
  {
    id: "3",
    name: "Umbilical Catheter Kit",
    category: "Medical Equipment",
    thermalRating: "N/A",
    compatibleUnits: ["Unit #1", "Unit #2", "Unit #4"],
    sku: "UCK-305",
    notes: "For NICU-grade emergency vascular access"
  },
  
  // Safety Equipment
  {
    id: "4",
    name: "Infant Restraint Harness",
    category: "Safety Equipment",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "IRH-410",
    notes: "Adjustable harness system designed for neonatal bodies, compatible with all bedding options"
  },
  {
    id: "5",
    name: "Fire Retardant Transport Cover",
    category: "Safety Equipment",
    thermalRating: "34.0°C - 38.0°C",
    compatibleUnits: ["Unit #1", "Unit #2", "Unit #3", "Unit #4", "Unit #5"],
    sku: "FRC-520",
    notes: "Lightweight, compliant with medical fire safety standards for critical scenarios"
  },
  
  // Blankets/Bedding
  {
    id: "6",
    name: "Thermal Blanket Pro",
    category: "Blankets/Bedding",
    thermalRating: "35.5°C - 37.5°C",
    compatibleUnits: ["Unit #1", "Unit #2", "Unit #3"],
    sku: "TB-001-A",
    notes: "Recommended for all standard transport units"
  },
  {
    id: "7",
    name: "Moisture-Wicking Insert Pad",
    category: "Blankets/Bedding",
    thermalRating: "36.0°C - 37.0°C",
    compatibleUnits: ["Unit #1", "Unit #2", "Unit #3", "Unit #4"],
    sku: "MWP-635",
    notes: "Keeps infants dry during long transports, while maintaining thermal performance"
  },
  {
    id: "8",
    name: "Phototherapy-Compatible Blanket",
    category: "Blankets/Bedding",
    thermalRating: "36.0°C - 37.5°C",
    compatibleUnits: ["Unit #1", "Unit #3"],
    sku: "PCB-745",
    notes: "For jaundiced infants during transport; allows for passive light therapy"
  },
  {
    id: "9",
    name: "Insulation Pad Plus",
    category: "Blankets/Bedding",
    thermalRating: "36.0°C - 37.0°C",
    compatibleUnits: ["Unit #2", "Unit #4"],
    sku: "IP-205-B",
    notes: "Provides additional insulation for high-risk transports"
  },
  {
    id: "10",
    name: "Temperature Regulating Sheet",
    category: "Blankets/Bedding",
    thermalRating: "36.0°C - 37.5°C",
    compatibleUnits: ["Unit #1", "Unit #3"],
    sku: "TRS-450",
    notes: "Active temperature regulation for premature infants"
  },
  
  // Accessories
  {
    id: "11",
    name: "Transport Power Adapter Kit",
    category: "Accessories",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "PAK-850",
    notes: "For ambulance, helicopter, and rural facility power compatibility"
  },
  {
    id: "12",
    name: "Modular Storage Pouch Set",
    category: "Accessories",
    thermalRating: "N/A",
    compatibleUnits: ["Unit #1", "Unit #2", "Unit #3", "Unit #4", "Unit #5"],
    sku: "MSP-955",
    notes: "For quick access to meds, charts, or emergency tools within the unit"
  },
  {
    id: "13",
    name: "Hygienic Insert Liners",
    category: "Accessories",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "HIL-1060",
    notes: "Disposable, quick-change liners to prevent cross-contamination"
  },
  {
    id: "14",
    name: "Vibration Dampening Mat",
    category: "Accessories",
    thermalRating: "N/A",
    compatibleUnits: ["Unit #1", "Unit #2", "Unit #3", "Unit #4", "Unit #5"],
    sku: "VDM-103",
    notes: "Reduces vibration exposure during transport"
  },
  {
    id: "15",
    name: "Thermal Reflective Cover",
    category: "Accessories",
    thermalRating: "35.0°C - 38.0°C",
    compatibleUnits: ["Unit #1", "Unit #2", "Unit #4"],
    sku: "TRC-220-A",
    notes: "For outdoor or long-distance transports"
  },
  
  // Maintenance
  {
    id: "16",
    name: "Battery Health Monitor",
    category: "Maintenance",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "BHM-1165",
    notes: "Add-on diagnostic tool to check battery life and cycles"
  },
  {
    id: "17",
    name: "Environmental Sensor Tester",
    category: "Maintenance",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "EST-1270",
    notes: "Verifies that temperature and vibration sensors are operational and within spec"
  },
  {
    id: "18",
    name: "Sensor Calibration Kit",
    category: "Maintenance",
    thermalRating: "Calibration tool",
    compatibleUnits: ["All Units"],
    sku: "SCK-001",
    notes: "For monthly sensor calibration"
  },
  
  // Smart Items
  {
    id: "19",
    name: "Smart Thermal Overlay (Beta)",
    category: "Smart Items",
    thermalRating: "35.0°C - 38.0°C",
    compatibleUnits: ["Unit #1", "Unit #3", "Unit #5"],
    sku: "STO-1375",
    notes: "IoT-compatible sensor sheet that gives real-time feedback via dashboard"
  },
  {
    id: "20",
    name: "Remote Monitoring Dongle",
    category: "Smart Items",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "RMD-1480",
    notes: "Sends status back to command center or hospital in case of multi-transport coordination"
  }
];

export default function CompatibleItems() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  // Filter items based on search term and category
  const filteredItems = compatibleItems.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === "" || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for filter
  const categories = Array.from(new Set(compatibleItems.map(item => item.category)));

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-4 py-4 flex-grow">
        <h1 className="text-2xl font-semibold mb-4">Compatible Items Reference</h1>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    placeholder="Search by name, SKU, or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-2.5 text-[#616161]">
                    <Icon name="filter" size={16} />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={categoryFilter === "" ? "default" : "outline"}
                  onClick={() => setCategoryFilter("")}
                  className={categoryFilter === "" ? "bg-[#6A1B9A]" : ""}
                >
                  All
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={categoryFilter === category ? "default" : "outline"}
                    onClick={() => setCategoryFilter(category)}
                    className={categoryFilter === category ? "bg-[#6A1B9A]" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-[#616161]">{item.category} | SKU: {item.sku}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-[#616161] mb-1">Thermal Rating</p>
                    <div className="flex items-center">
                      <Icon name="temperature" size={18} className="text-[#9C27B0] mr-1" />
                      <span className="font-medium">{item.thermalRating}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-[#616161] mb-1">Compatible Units</p>
                    <div className="flex flex-wrap gap-1">
                      {item.compatibleUnits.map((unit, i) => (
                        <span 
                          key={i} 
                          className="inline-block bg-[#F3E5F5] text-[#6A1B9A] text-xs px-2 py-1 rounded-md"
                        >
                          {unit}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-[#616161] mb-1">Notes</p>
                    <p className="text-sm">{item.notes}</p>
                  </div>
                </div>
                
                <div className="mt-4 border-t border-gray-100 pt-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="w-full border-[#6A1B9A] text-[#6A1B9A] hover:bg-[#6A1B9A]/5">
                          <Icon name="info" size={16} className="mr-1" />
                          View Details
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white p-3 shadow-lg rounded-md border max-w-md">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">View detailed item information including:</p>
                          <ul className="text-xs space-y-1 text-gray-600 pl-2">
                            <li>• Complete technical specifications and dimensions</li>
                            <li>• Certification and compliance documentation</li>
                            <li>• Installation and usage instructions</li>
                            <li>• Maintenance schedule and replacement parts</li>
                            <li>• Order information and availability status</li>
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[#616161]">No items found matching your search criteria.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
