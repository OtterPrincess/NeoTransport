import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { toast } from "@/hooks/use-toast";
import { getCategoryIllustration } from "./category-illustrations";

// Import the types from the compatible-items page
interface CompatibleItem {
  id: string;
  name: string;
  category: string;
  thermalRating: string;
  compatibleUnits: string[];
  sku: string;
  notes: string;
}

// Extended item type with detailed information for the dialog
interface ItemDetailProps {
  item: CompatibleItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define detailed specifications - in a real app, this would come from an API
const getDetailedSpecs = (item: CompatibleItem) => {
  // Basic specs that all items would have
  const specs: Record<string, string> = {
    "Thermal Rating": item.thermalRating,
    "Category": item.category,
    "SKU": item.sku,
  };
  
  // Category-specific specs
  switch (item.category) {
    case "Medical Equipment":
      specs["Power Source"] = "AC/DC Adapter, Battery Backup";
      specs["Certification"] = "IEC 60601-1, ISO 13485";
      specs["Sterilization"] = "Autoclave Compatible";
      break;
    case "Safety Equipment":
      specs["Material"] = "Latex-free, Hypoallergenic";
      specs["Fire Rating"] = "Class 1, NFPA 701";
      specs["Weight Tolerance"] = "Up to 8 kg";
      break;
    case "Blankets/Bedding":
      specs["Material"] = "Medical-grade Microfiber, Hypoallergenic";
      specs["Washable"] = "Yes, Machine Washable";
      specs["Dimensions"] = "50cm x 65cm";
      break;
    case "Accessories":
      specs["Compatibility"] = item.compatibleUnits.join(", ");
      specs["Installation"] = "Tool-free, Snap-on";
      break;
    case "Maintenance":
      specs["Calibration Period"] = "6 months";
      specs["Warranty"] = "12 months";
      break;
    case "Smart Items":
      specs["Connectivity"] = "Bluetooth 5.0, WiFi";
      specs["Battery Life"] = "12 hours continuous";
      specs["Data Logging"] = "Yes, encrypted HIPAA-compliant";
      break;
    default:
      break;
  }
  
  // Add compatible units if not already added
  if (!specs["Compatibility"]) {
    specs["Compatibility"] = item.compatibleUnits.join(", ");
  }
  
  return specs;
};

// Define usage guidance based on category
const getUsageGuidance = (item: CompatibleItem) => {
  switch (item.category) {
    case "Medical Equipment":
      return "For clinical use only by trained medical personnel. Must be inspected before each use.";
    case "Safety Equipment":
      return "Essential for all transports. Follow hospital protocols for securing patient.";
    case "Blankets/Bedding":
      return "Warm to touch before placing with infant. Monitor temperature regularly during use.";
    case "Accessories":
      return "Install securely before transport. Verify compatibility with specific unit model.";
    case "Maintenance":
      return "For use by qualified technicians. Follow calibration schedule strictly.";
    case "Smart Items":
      return "Requires pairing with hospital network. Ensure charged before transport.";
    default:
      return "Follow manufacturer guidelines for proper use and maintenance.";
  }
};

// Define warnings based on category
const getWarnings = (item: CompatibleItem) => {
  switch (item.category) {
    case "Medical Equipment":
      return "Do not use if damaged. Keep away from water and extreme temperatures.";
    case "Safety Equipment":
      return "Check integrity before each use. Replace if showing signs of wear or damage.";
    case "Blankets/Bedding":
      if (item.thermalRating !== "N/A") {
        return `Do not exceed the thermal rating of ${item.thermalRating}. Monitor patient temperature continuously.`;
      }
      return "Monitor patient temperature continuously. Replace if soiled.";
    case "Accessories":
      return "Verify secure attachment before transport. Do not modify or alter.";
    case "Maintenance":
      return "Calibrate only in controlled environment. Use only approved testing standards.";
    case "Smart Items":
      return "Do not rely solely on smart device readings. Always verify with manual checks.";
    default:
      return "Use only as directed. Report any malfunctions immediately.";
  }
};

export const ItemDetailDialog: React.FC<ItemDetailProps> = ({ 
  item, 
  open, 
  onOpenChange 
}) => {
  const handleReportIncompatibility = () => {
    toast({
      title: "Incompatibility Reported",
      description: `Thank you for reporting an issue with ${item.name}. Our team will review.`,
      variant: "default",
    });
    // In a real app, this would send data to a server
  };
  
  const handleRequestProcurement = () => {
    toast({
      title: "Procurement Information Requested",
      description: "Procurement details have been sent to your email.",
      variant: "default",
    });
    // In a real app, this would trigger an email or form
  };
  
  const detailedSpecs = getDetailedSpecs(item);
  const usageGuidance = getUsageGuidance(item);
  const warnings = getWarnings(item);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl font-semibold text-[#6A1B9A]">
              {item.name}
            </DialogTitle>
            <Badge className="bg-[#6A1B9A] hover:bg-[#6A1B9A]/90">
              {item.category}
            </Badge>
          </div>
          <DialogDescription className="flex flex-wrap items-center gap-1">
            <span className="text-[#616161] font-medium">SKU: {item.sku}</span>
            <span className="mx-2">•</span>
            <span className="text-[#616161]">
              Compatible with: {item.compatibleUnits.length > 3 ? 
                `${item.compatibleUnits.slice(0, 3).join(", ")}, +${item.compatibleUnits.length - 3} more` : 
                item.compatibleUnits.join(", ")}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          {/* Left Column - Category Illustration */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-medium mb-2 text-[#6A1B9A]">Illustration</h4>
            <div className="border rounded-lg h-36 p-2 bg-white flex items-center justify-center">
              {getCategoryIllustration(item.category)}
            </div>
          </div>
          
          {/* Middle + Right Columns - Specs & Info */}
          <div className="md:col-span-2 space-y-3">
            {/* Specifications */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-[#6A1B9A]">Specifications</h4>
              <div className="rounded-lg border overflow-hidden text-sm max-h-36 overflow-y-auto">
                {Object.entries(detailedSpecs).map(([key, value], index) => (
                  <div key={key} className={`flex ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <div className="w-2/5 px-3 py-1.5 text-[#616161] font-medium border-r">{key}</div>
                    <div className="w-3/5 px-3 py-1.5">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Description & Usage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <h4 className="text-sm font-medium mb-1 text-[#6A1B9A]">Description</h4>
                <div className="px-3 py-2 border rounded-lg text-sm bg-white">
                  {item.notes}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1 text-[#6A1B9A]">Usage</h4>
                <div className="px-3 py-2 border rounded-lg text-sm bg-white">
                  {usageGuidance}
                </div>
              </div>
            </div>
            
            {/* Warnings */}
            <div>
              <h4 className="text-sm font-medium mb-1 text-[#6A1B9A] flex items-center">
                <Icon name="alert" size={14} className="mr-1 text-red-600" />
                Warnings
              </h4>
              <div className="px-3 py-2 border border-red-200 rounded-lg text-sm bg-red-50 text-red-700">
                {warnings}
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-3" />
        
        <DialogFooter className="flex flex-wrap sm:flex-row gap-2 sm:justify-between">
          <DialogClose asChild>
            <Button size="sm" variant="outline" className="text-[#616161]">
              <Icon name="back" size={14} className="mr-1" />
              Back
            </Button>
          </DialogClose>
          
          <div className="flex gap-2 ml-auto">
            <Button 
              size="sm"
              variant="outline" 
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleReportIncompatibility}
            >
              <Icon name="alert" size={14} className="mr-1" />
              Report Issue
            </Button>
            
            <Button 
              size="sm"
              className="bg-[#6A1B9A] hover:bg-[#6A1B9A]/90 text-white"
              onClick={handleRequestProcurement}
            >
              <Icon name="items" size={14} className="mr-1" />
              Procurement Info
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailDialog;