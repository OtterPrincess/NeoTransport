import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import Header from "@/components/dashboard/header";
import TabNavigation from "@/components/dashboard/tab-navigation";
import Footer from "@/components/dashboard/footer";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsNew() {
  const { settings, updateSettings } = useAppSettings();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Settings are automatically saved via context
      toast({ title: "Settings saved successfully" });
    } catch (error) {
      toast({ title: "Failed to save settings", variant: "destructive" });
    }
    setIsSaving(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-6 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
            <p className="text-slate-600">Customize your Nestara experience</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Settings */}
            <Card className="lg:col-span-2 shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900">Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">Username</h3>
                    <p className="text-sm text-slate-600">{user?.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">Role</h3>
                    <p className="text-sm text-slate-600 capitalize">{user?.role}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {isSaving ? "Saving..." : "Save All Settings"}
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Settings
                </Button>
              </CardContent>
            </Card>

            {/* Alert Settings */}
            <Card className="lg:col-span-2 shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">Sound Notifications</h3>
                    <p className="text-sm text-slate-600">Play sounds for alerts and notifications</p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">Microsoft Teams Integration</h3>
                    <p className="text-sm text-slate-600">Send alerts to Teams channels</p>
                  </div>
                  <Switch
                    checked={settings.teamsIntegrationEnabled}
                    onCheckedChange={(checked) => updateSettings({ teamsIntegrationEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">Auto-refresh Dashboard</h3>
                    <p className="text-sm text-slate-600">Automatically update data every 30 seconds</p>
                  </div>
                  <Switch
                    checked={settings.autoRefresh}
                    onCheckedChange={(checked) => updateSettings({ autoRefresh: checked })}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-medium text-slate-900">Sound Profile</h3>
                  <p className="text-sm text-slate-600">Choose your preferred alert sound style</p>
                  <Select
                    value={settings.soundProfile}
                    onValueChange={(value) => updateSettings({ soundProfile: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gentle">Gentle & Calm</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="urgent">Urgent & Direct</SelectItem>
                      <SelectItem value="nature">Nature Sounds</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* System Preferences */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900">System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-slate-900">Theme</h3>
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-slate-900">Language</h3>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-slate-900">Time Zone</h3>
                  <Select defaultValue="auto">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="lg:col-span-3 shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900">Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">HIPAA Compliance Mode</h3>
                      <p className="text-sm text-slate-600">Enhanced data protection for medical records</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Activity Logging</h3>
                      <p className="text-sm text-slate-600">Track user actions for audit trails</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Data Encryption</h3>
                      <p className="text-sm text-slate-600">End-to-end encryption for sensitive data</p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Session Timeout</h3>
                      <p className="text-sm text-slate-600">Automatic logout after inactivity</p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 min</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}