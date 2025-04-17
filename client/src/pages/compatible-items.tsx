import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/dashboard/header";
import TabNavigation from "@/components/dashboard/tab-navigation";
import Footer from "@/components/dashboard/footer";
import Icon from "@/components/ui/icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface CompatibleItem {
  id: string;
  name: string;
  category: string;
  thermalRating: string;
  compatibleUnits: string[];
  sku: string;
  notes: string;
  weightRange?: string;
  ageRange?: string;
  clinicalGuidelines?: string[];
  safetyStandards?: string[];
}

// Sample items for the page - in a real app, this would come from an API
const compatibleItems: CompatibleItem[] = [
  {
    id: "9",
    name: "Portable Suction Unit",
    category: "Medical Equipment",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "PSU-100",
    notes: "For clearing airways in emergency en route situations",
    clinicalGuidelines: [
      "Check suction pressure before each use",
      "Replace collection container after each use",
      "Maintain sterile technique during operation"
    ],
    safetyStandards: [
      "ISO 10079-1 certified",
      "Meets emergency transport standards",
      "Battery backup equipped"
    ]
  },
  {
    id: "10",
    name: "Integrated Vital Signs Monitor Clip-on",
    category: "Medical Equipment",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "VSM-200",
    notes: "Compact, unit-attachable monitor for heart rate, SpO2, and temperature",
    clinicalGuidelines: [
      "Calibrate before each transport",
      "Verify sensor placement",
      "Monitor battery status"
    ],
    safetyStandards: [
      "FDA cleared monitoring device",
      "EMI/RFI shielded",
      "Transport-grade durability"
    ]
  },
  {
    id: "11",
    name: "Umbilical Catheter Kit",
    category: "Medical Equipment",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "UCK-300",
    notes: "For NICU-grade emergency vascular access",
    clinicalGuidelines: [
      "Sterile field required",
      "Use within size-appropriate guidelines",
      "Monitor insertion depth markers"
    ],
    safetyStandards: [
      "Sterile packaging",
      "Single-use components",
      "Transport-compatible design"
    ]
  },
  {
    id: "12",
    name: "Infant Restraint Harness",
    category: "Safety Equipment",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "IRH-400",
    notes: "Adjustable harness system designed for neonatal bodies",
    weightRange: "500g - 5000g",
    safetyStandards: [
      "Crash-tested design",
      "Quick-release mechanism",
      "Anti-allergenic material"
    ]
  },
  {
    id: "13",
    name: "Fire Retardant Transport Cover",
    category: "Safety Equipment",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "FRC-500",
    notes: "Lightweight, compliant with medical fire safety standards",
    safetyStandards: [
      "Meets NFPA standards",
      "Chemical-free fire resistance",
      "High visibility markers"
    ]
  },
  {
    id: "14",
    name: "Moisture-Wicking Insert Pad",
    category: "Blankets",
    thermalRating: "36.0°C - 37.5°C",
    compatibleUnits: ["All Units"],
    sku: "MWP-600",
    notes: "Keeps infants dry during long transports while maintaining thermal performance"
  },
  {
    id: "15",
    name: "Phototherapy-Compatible Blanket",
    category: "Blankets",
    thermalRating: "36.0°C - 37.5°C",
    compatibleUnits: ["All Units"],
    sku: "PCB-700",
    notes: "For jaundiced infants during transport; allows for passive light therapy"
  },
  {
    id: "16",
    name: "Transport Power Adapter Kit",
    category: "Accessories",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "PAK-800",
    notes: "For ambulance, helicopter, and rural facility power compatibility",
    safetyStandards: [
      "Multiple voltage compatibility",
      "Surge protection",
      "Emergency backup switch"
    ]
  },
  {
    id: "17",
    name: "Modular Storage Pouch Set",
    category: "Accessories",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "MSP-900",
    notes: "For quick access to meds, charts, or emergency tools within the unit"
  },
  {
    id: "18",
    name: "Hygienic Insert Liners",
    category: "Accessories",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "HIL-1000",
    notes: "Disposable, quick-change liners to prevent cross-contamination"
  },
  {
    id: "19",
    name: "Battery Health Monitor",
    category: "Maintenance",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "BHM-1100",
    notes: "Add-on diagnostic tool to check battery life and cycles"
  },
  {
    id: "20",
    name: "Environmental Sensor Tester",
    category: "Maintenance",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "EST-1200",
    notes: "Verifies that temperature and vibration sensors are operational and within spec"
  },
  {
    id: "1",
    name: "French Tube Set",
    category: "Medical Equipment",
    thermalRating: "N/A",
    compatibleUnits: ["Unit #1", "Unit #2", "Unit #3"],
    sku: "FT-120-S",
    notes: "Sterile French tube set for neonatal airways",
    weightRange: "500g - 2500g",
    ageRange: "Premature - 3 months",
    clinicalGuidelines: [
      "Use appropriate size based on patient weight",
      "Replace every 24 hours or as needed",
      "Maintain sterile technique during insertion"
    ],
    safetyStandards: [
      "ISO 13485:2016 certified",
      "Latex-free material",
      "Single-use only"
    ]
  },
  {
    id: "2",
    name: "Evacuation Apron",
    category: "Safety Equipment",
    thermalRating: "N/A",
    compatibleUnits: ["All Units"],
    sku: "EA-450-M",
    notes: "Protective apron for emergency transport situations",
    clinicalGuidelines: [
      "One size fits most medical staff",
      "Must be worn during emergency evacuations",
      "Check integrity before each use"
    ],
    safetyStandards: [
      "Fire-resistant material",
      "High-visibility reflective strips",
      "Meets emergency transport standards"
    ]
  },
  {
    id: "3",
    name: "Thermal Blanket Pro",
    category: "Blankets",
    thermalRating: "35.5°C - 37.5°C",
    compatibleUnits: ["Unit #1", "Unit #2", "Unit #3"],
    sku: "TB-001-A",
    notes: "Recommended for all standard transport units"
  },
  {
    id: "4",
    name: "Insulation Pad Plus",
    category: "Bedding",
    thermalRating: "36.0°C - 37.0°C",
    compatibleUnits: ["Unit #2", "Unit #4"],
    sku: "IP-205-B",
    notes: "Provides additional insulation for high-risk transports"
  },
  {
    id: "5",
    name: "Vibration Dampening Mat",
    category: "Accessories",
    thermalRating: "N/A",
    compatibleUnits: ["Unit #1", "Unit #2", "Unit #3", "Unit #4", "Unit #5"],
    sku: "VDM-103",
    notes: "Reduces vibration exposure during transport"
  },
  {
    id: "6",
    name: "Temperature Regulating Sheet",
    category: "Bedding",
    thermalRating: "36.0°C - 37.5°C",
    compatibleUnits: ["Unit #1", "Unit #3"],
    sku: "TRS-450",
    notes: "Active temperature regulation for premature infants"
  },
  {
    id: "7",
    name: "Sensor Calibration Kit",
    category: "Maintenance",
    thermalRating: "Calibration tool",
    compatibleUnits: ["All Units"],
    sku: "SCK-001",
    notes: "For monthly sensor calibration"
  },
  {
    id: "8",
    name: "Thermal Reflective Cover",
    category: "Accessories",
    thermalRating: "35.0°C - 38.0°C",
    compatibleUnits: ["Unit #1", "Unit #2", "Unit #4"],
    sku: "TRC-220-A",
    notes: "For outdoor or long-distance transports"
  }
];

export default function CompatibleItems() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState<CompatibleItem | null>(null);
  
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
        <h1 className="text-2xl font-semibold mb-2">Compatible Items Reference</h1>
        
        <div className="bg-[#F3E5F5] text-[#6A1B9A] p-4 rounded-md mb-6">
          <h3 className="font-medium mb-1">What is this?</h3>
          <p className="text-sm">
            This section lists equipment and accessories specifically designed to work with Nestara neonatal transport units.
            These items are temperature-rated and safety-tested to ensure optimal conditions during transport.
            Click "View Details" on any item to see compatibility information, usage instructions, and to request supplies.
          </p>
        </div>
        
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
                  <Button 
                    variant="outline" 
                    className="w-full border-[#6A1B9A] text-[#6A1B9A] hover:bg-[#6A1B9A]/5"
                    onClick={() => setSelectedItem(item)}
                  >
                    <Icon name="info" size={16} className="mr-1" />
                    View Details
                  </Button>
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
      
      {/* Item Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
            <DialogDescription>
              {selectedItem?.category} | SKU: {selectedItem?.sku}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Product Description</h4>
              <p className="text-sm">
                {selectedItem?.notes}
                {selectedItem?.category === "Blankets" && 
                  " This specialized thermal blanket is designed to maintain optimal temperature for neonatal transport. It features micro-insulation technology that adapts to ambient conditions."}
                {selectedItem?.category === "Bedding" && 
                  " This advanced bedding material regulates temperature and provides maximum comfort during transport. It's hypoallergenic and designed for premature infants."}
                {selectedItem?.category === "Accessories" && 
                  " This accessory improves the safety and comfort of neonatal transport by reducing external environmental factors that could affect the infant."}
                {selectedItem?.category === "Maintenance" && 
                  " This maintenance kit is essential for ensuring all monitoring systems are calibrated correctly for accurate readings."}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-2">Thermal Specifications</h4>
              <div className="flex items-center">
                <Icon name="temperature" size={18} className="text-[#9C27B0] mr-2" />
                <span className="font-medium">{selectedItem?.thermalRating}</span>
              </div>
              <p className="text-sm mt-2">
                {selectedItem?.thermalRating !== "N/A" && selectedItem?.thermalRating !== "Calibration tool" && 
                  "This temperature range is optimal for neonatal transport and helps maintain the infant's core temperature within safe parameters."}
                {selectedItem?.thermalRating === "N/A" && 
                  "This item doesn't have a thermal rating as it's designed for vibration reduction rather than temperature regulation."}
                {selectedItem?.thermalRating === "Calibration tool" && 
                  "This tool ensures all temperature sensors in the transport unit are accurately calibrated."}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-2">Compatible Transport Units</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedItem?.compatibleUnits.map((unit, i) => (
                  <span 
                    key={i} 
                    className="inline-block bg-[#F3E5F5] text-[#6A1B9A] text-xs px-2 py-1 rounded-md"
                  >
                    {unit}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Clinical Parameters</h4>
                {selectedItem?.weightRange && (
                  <div className="mb-2">
                    <span className="text-xs text-[#616161]">Weight Range:</span>
                    <p className="text-sm">{selectedItem.weightRange}</p>
                  </div>
                )}
                {selectedItem?.ageRange && (
                  <div className="mb-2">
                    <span className="text-xs text-[#616161]">Age Range:</span>
                    <p className="text-sm">{selectedItem.ageRange}</p>
                  </div>
                )}
              </div>
              
              {selectedItem?.clinicalGuidelines && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Clinical Guidelines</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selectedItem.clinicalGuidelines.map((guideline, i) => (
                      <li key={i}>{guideline}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedItem?.safetyStandards && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Safety Standards</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selectedItem.safetyStandards.map((standard, i) => (
                      <li key={i}>{standard}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Usage Instructions</h4>
                <p className="text-sm">
                  To use this item with your transport unit, please follow the manufacturer guidelines
                  and clinical protocols. Always ensure proper sanitization and secure attachment before
                  transport begins. Monitor patient vitals when using this equipment.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              toast({
                title: "Item added to request list",
                description: "Your supply request has been updated",
                variant: "default",
              });
              setSelectedItem(null);
            }} className="mr-2">
              Add to Request
            </Button>
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
