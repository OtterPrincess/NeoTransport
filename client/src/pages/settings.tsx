import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/dashboard/header";
import TabNavigation from "@/components/dashboard/tab-navigation";
import Footer from "@/components/dashboard/footer";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import { TEMPERATURE_RANGES, VIBRATION_THRESHOLDS, BATTERY_THRESHOLDS } from "@/lib/constants";

export default function Settings() {
  const { toast } = useToast();
  
  // General settings
  const [refreshInterval, setRefreshInterval] = useState("30");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [teamsIntegration, setTeamsIntegration] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  
  // Alert settings
  const [internalTempMin, setInternalTempMin] = useState(TEMPERATURE_RANGES.internal.min.toString());
  const [internalTempMax, setInternalTempMax] = useState(TEMPERATURE_RANGES.internal.max.toString());
  const [surfaceTempMin, setSurfaceTempMin] = useState(TEMPERATURE_RANGES.surface.min.toString());
  const [surfaceTempMax, setSurfaceTempMax] = useState(TEMPERATURE_RANGES.surface.max.toString());
  const [vibrationThreshold, setVibrationThreshold] = useState(VIBRATION_THRESHOLDS.warning.toString());
  const [batteryWarning, setBatteryWarning] = useState(BATTERY_THRESHOLDS.warning.toString());
  const [batteryAlert, setBatteryAlert] = useState(BATTERY_THRESHOLDS.alert.toString());
  
  // User settings
  const [displayName, setDisplayName] = useState("Admin User");
  const [role, setRole] = useState("head_nurse");
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  const handleSaveSettings = () => {
    // This would typically send the settings to an API endpoint
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
      duration: 3000,
    });
  };
  
  const handleResetDefaults = () => {
    // Reset to default values
    setRefreshInterval("30");
    setAutoRefresh(true);
    setTeamsIntegration(true);
    setSoundAlerts(true);
    
    setInternalTempMin(TEMPERATURE_RANGES.internal.min.toString());
    setInternalTempMax(TEMPERATURE_RANGES.internal.max.toString());
    setSurfaceTempMin(TEMPERATURE_RANGES.surface.min.toString());
    setSurfaceTempMax(TEMPERATURE_RANGES.surface.max.toString());
    setVibrationThreshold(VIBRATION_THRESHOLDS.warning.toString());
    setBatteryWarning(BATTERY_THRESHOLDS.warning.toString());
    setBatteryAlert(BATTERY_THRESHOLDS.alert.toString());
    
    toast({
      title: "Defaults Restored",
      description: "Settings have been reset to default values.",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-4 py-4 flex-grow">
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="alerts">Alert Thresholds</TabsTrigger>
            <TabsTrigger value="user">User Preferences</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoRefresh">Auto-Refresh Dashboard</Label>
                    <Switch
                      id="autoRefresh"
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                    />
                  </div>
                  <p className="text-sm text-[#616161]">Automatically refresh dashboard data at regular intervals</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                  <Select
                    disabled={!autoRefresh}
                    value={refreshInterval}
                    onValueChange={setRefreshInterval}
                  >
                    <SelectTrigger id="refreshInterval">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="refresh-10" value="10">10 seconds</SelectItem>
                      <SelectItem key="refresh-30" value="30">30 seconds</SelectItem>
                      <SelectItem key="refresh-60" value="60">1 minute</SelectItem>
                      <SelectItem key="refresh-300" value="300">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="teamsIntegration">Microsoft Teams Integration</Label>
                    <Switch
                      id="teamsIntegration"
                      checked={teamsIntegration}
                      onCheckedChange={setTeamsIntegration}
                    />
                  </div>
                  <p className="text-sm text-[#616161]">Enable sending alerts to Microsoft Teams</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="soundAlerts">Sound Alerts</Label>
                    <Switch
                      id="soundAlerts"
                      checked={soundAlerts}
                      onCheckedChange={setSoundAlerts}
                    />
                  </div>
                  <p className="text-sm text-[#616161]">Play sound when new alerts are received</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Alert Threshold Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Internal Temperature Range (°C)</h3>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="space-y-2">
                      <Label htmlFor="internalTempMin">Minimum Normal</Label>
                      <Input
                        id="internalTempMin"
                        type="number"
                        value={internalTempMin}
                        onChange={(e) => setInternalTempMin(e.target.value)}
                        step="0.1"
                        min="30"
                        max="40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="internalTempMax">Maximum Normal</Label>
                      <Input
                        id="internalTempMax"
                        type="number"
                        value={internalTempMax}
                        onChange={(e) => setInternalTempMax(e.target.value)}
                        step="0.1"
                        min="30"
                        max="40"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-[#616161]">Values outside this range will trigger a warning. Values that exceed 1°C outside will trigger an alert.</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Surface Temperature Range (°C)</h3>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="space-y-2">
                      <Label htmlFor="surfaceTempMin">Minimum Normal</Label>
                      <Input
                        id="surfaceTempMin"
                        type="number"
                        value={surfaceTempMin}
                        onChange={(e) => setSurfaceTempMin(e.target.value)}
                        step="0.1"
                        min="30"
                        max="40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surfaceTempMax">Maximum Normal</Label>
                      <Input
                        id="surfaceTempMax"
                        type="number"
                        value={surfaceTempMax}
                        onChange={(e) => setSurfaceTempMax(e.target.value)}
                        step="0.1"
                        min="30"
                        max="40"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-[#616161]">Values outside this range will trigger a warning. Values that exceed 0.5°C outside will trigger an alert.</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Vibration Threshold (g-force)</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="vibrationThreshold">Warning Threshold</Label>
                        <span className="text-sm font-medium">{vibrationThreshold}g</span>
                      </div>
                      <Slider
                        id="vibrationThreshold"
                        value={[parseFloat(vibrationThreshold)]}
                        onValueChange={(value) => setVibrationThreshold(value[0].toString())}
                        max={1}
                        min={0}
                        step={0.05}
                        className="w-full"
                      />
                    </div>
                    <p className="text-sm text-[#616161]">Values above this threshold will trigger a warning. Values above {(parseFloat(vibrationThreshold) + 0.3).toFixed(2)}g will trigger an alert.</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Battery Thresholds (%)</h3>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="space-y-2">
                      <Label htmlFor="batteryWarning">Warning Level</Label>
                      <Input
                        id="batteryWarning"
                        type="number"
                        value={batteryWarning}
                        onChange={(e) => setBatteryWarning(e.target.value)}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="batteryAlert">Alert Level</Label>
                      <Input
                        id="batteryAlert"
                        type="number"
                        value={batteryAlert}
                        onChange={(e) => setBatteryAlert(e.target.value)}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-[#616161]">Battery levels below these thresholds will trigger respective warnings or alerts.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="role-head-nurse" value="head_nurse">Head Nurse</SelectItem>
                      <SelectItem key="role-assigned-nurse" value="assigned_nurse">Assigned Nurse</SelectItem>
                      <SelectItem key="role-tech-support" value="tech_support">Technical Support</SelectItem>
                      <SelectItem key="role-admin" value="admin">Administrator</SelectItem>
                      <SelectItem key="role-director" value="director">Director</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                {role !== 'director' ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <Switch
                        id="emailNotifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <p className="text-sm text-[#616161]">Receive important alerts via email</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="notificationFrequency">Notification Frequency</Label>
                    <Select value={emailNotifications ? "summary" : "none"} onValueChange={(value) => setEmailNotifications(value !== "none")}>
                      <SelectTrigger id="notificationFrequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="critical">Only critical alerts</SelectItem>
                        <SelectItem value="summary">Weekly summary report</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-[#616161]">Choose how you want to receive alerts and reports</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[#616161]">Version</Label>
                  <p className="font-medium">Nestara Monitor v1.0.5</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[#616161]">Last Update</Label>
                  <p className="font-medium">June 24, 2023</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[#616161]">API Status</Label>
                  <div className="flex items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#66BB6A] mr-2"></span>
                    <p className="font-medium">Connected</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[#616161]">Teams Integration</Label>
                  <div className="flex items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#66BB6A] mr-2"></span>
                    <p className="font-medium">Active</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <p className="text-sm text-[#616161]">Detailed system logs and diagnostics for technical support</p>
                  <Button variant="outline" className="text-[#616161]">
                    <Icon name="report" size={16} className="mr-1" />
                    Export System Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={handleResetDefaults}>
            Reset to Defaults
          </Button>
          <Button className="bg-[#6A1B9A] hover:bg-[#6A1B9A]/90" onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
