import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/dashboard/header";
import TabNavigation from "@/components/dashboard/tab-navigation";
import Footer from "@/components/dashboard/footer";
import { useToast } from "@/hooks/use-toast";

// Available sound types for alerts
const ALERT_SOUND_TYPES = [
  { id: "gentle", name: "Gentle Chime", description: "Soft, pleasant bell tones that won't startle staff or patients" },
  { id: "attention", name: "Melodic Pattern", description: "Calming three-note sequence that remains distinct without being jarring" },
  { id: "urgent", name: "Rising Tone", description: "Progressively increasing tone that conveys urgency without being harsh or alarming" },
  { id: "melodic", name: "Soothing Melody", description: "A gentle, pleasing melody that's calming but noticeable in a hospital environment" },
  { id: "nature", name: "Nature Sound", description: "Peaceful nature-like sounds that promote a calming atmosphere while still alerting staff" }
];

// Alert categories to customize
const ALERT_CATEGORIES = [
  { id: "temperature", name: "Temperature Alerts", description: "Alerts related to internal or surface temperature" },
  { id: "vibration", name: "Vibration Alerts", description: "Alerts related to excessive motion or vibration" },
  { id: "battery", name: "Battery Alerts", description: "Alerts related to battery level or charging status" },
  { id: "connection", name: "Connection Alerts", description: "Alerts related to connectivity issues or offline status" }
];

interface SoundProfile {
  id: string;
  name: string;
  configurations: {
    [category: string]: {
      soundType: string;
      volume: number;
      enabled: boolean;
    }
  };
  isActive: boolean;
}

const DEFAULT_PROFILE: SoundProfile = {
  id: "default",
  name: "Default Profile",
  configurations: {
    temperature: { soundType: "attention", volume: 70, enabled: true },
    vibration: { soundType: "urgent", volume: 85, enabled: true },
    battery: { soundType: "gentle", volume: 60, enabled: true },
    connection: { soundType: "melodic", volume: 75, enabled: true }
  },
  isActive: true
};

export default function SoundscapeGenerator() {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<SoundProfile[]>([DEFAULT_PROFILE]);
  const [activeProfile, setActiveProfile] = useState<SoundProfile>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState<string>("temperature");
  const [newProfileName, setNewProfileName] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  // Audio contexts for sound preview
  const audioContext = useRef<AudioContext | null>(null);
  
  // Initialize AudioContext when needed (must be from user interaction)
  const initAudioContext = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext.current;
  };
  
  // Load profiles from localStorage
  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem("nestara_sound_profiles");
      if (savedProfiles) {
        const parsedProfiles = JSON.parse(savedProfiles) as SoundProfile[];
        if (Array.isArray(parsedProfiles) && parsedProfiles.length > 0) {
          setProfiles(parsedProfiles);
          
          // Find the active profile
          const activeOne = parsedProfiles.find(p => p.isActive);
          if (activeOne) {
            setActiveProfile(activeOne);
          }
        }
      }
      setIsLoaded(true);
    } catch (error) {
      console.error("Error loading sound profiles:", error);
      // Fall back to default profile
      setIsLoaded(true);
    }
  }, []);
  
  // Save profiles to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("nestara_sound_profiles", JSON.stringify(profiles));
      } catch (error) {
        console.error("Error saving sound profiles:", error);
        toast({
          title: "Saving Error",
          description: "Unable to save your sound profiles to local storage.",
          variant: "destructive"
        });
      }
    }
  }, [profiles, isLoaded, toast]);
  
  // Generate a simple sound based on the sound type
  const playPreviewSound = (soundType: string, volume: number) => {
    try {
      const context = initAudioContext();
      
      // Create oscillator
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      // Configure sound based on type - using more pleasant and less startling sounds
      switch (soundType) {
        case "gentle":
          // Gentle bell-like sound using sine wave
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(698.46, context.currentTime); // F5 - pleasant bell-like tone
          
          // Gentle fade-in and fade-out for smooth sound
          gainNode.gain.setValueAtTime(0, context.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.25, context.currentTime + 0.1);
          gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
          break;
          
        case "attention":
          // Melodic three-note pattern with triangle wave for warmth
          oscillator.type = "triangle";
          
          // Smoother start volume
          gainNode.gain.setValueAtTime(0, context.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.3, context.currentTime + 0.05);
          
          // Schedule the three-note pattern
          oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
          oscillator.frequency.setValueAtTime(587.33, context.currentTime + 0.2); // D5
          oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.4); // E5
          
          // Gentle fade out
          gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.6);
          break;
          
        case "urgent":
          // Rising tone that's still pleasant (using sine instead of square)
          oscillator.type = "sine";
          
          // Start with a lower volume and frequency
          gainNode.gain.setValueAtTime(0, context.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.4, context.currentTime + 0.1);
          
          // Create a rising tone effect
          oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
          oscillator.frequency.linearRampToValueAtTime(783.99, context.currentTime + 0.4); // G5
          
          // Gentle fade out
          gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
          break;
          
        case "melodic":
          // Soothing melody with sine wave
          oscillator.type = "sine";
          
          // Gentle volume ramp
          gainNode.gain.setValueAtTime(0, context.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.3, context.currentTime + 0.05);
          
          // Create a calming melody sequence (C major pentatonic)
          oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
          oscillator.frequency.setValueAtTime(587.33, context.currentTime + 0.15); // D5
          oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.3); // E5
          oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.45); // G5
          oscillator.frequency.setValueAtTime(1046.50, context.currentTime + 0.6); // C6
          
          // Gentle fade out
          gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.8);
          break;
          
        case "nature":
          // Nature-like sound (bird chirp simulation)
          oscillator.type = "sine";
          
          // Bird chirp effect
          gainNode.gain.setValueAtTime(0, context.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.2, context.currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.15);
          gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.25, context.currentTime + 0.25);
          gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.4);
          
          // Frequency changes for bird-like effect
          oscillator.frequency.setValueAtTime(2200, context.currentTime);
          oscillator.frequency.setValueAtTime(2500, context.currentTime + 0.05);
          oscillator.frequency.setValueAtTime(2300, context.currentTime + 0.25);
          break;
          
        default:
          // Default gentle sound
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
          gainNode.gain.setValueAtTime(0, context.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.3, context.currentTime + 0.1);
          gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.4);
      }
      
      // Connect and play
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.start();
      
      // Stop after 0.8 seconds to allow the more complex sound patterns to complete
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
      }, 800);
    } catch (error) {
      console.error("Error playing sound:", error);
      toast({
        title: "Sound Preview Error",
        description: "There was an error playing the sound preview.",
        variant: "destructive"
      });
    }
  };
  
  // Update the active profile's configuration
  const updateProfileConfig = (category: string, field: string, value: any) => {
    const updatedProfile = { ...activeProfile };
    updatedProfile.configurations[category] = {
      ...updatedProfile.configurations[category],
      [field]: value
    };
    
    setActiveProfile(updatedProfile);
    
    // Update the profile in the profiles list
    const updatedProfiles = profiles.map(profile => 
      profile.id === activeProfile.id ? updatedProfile : profile
    );
    setProfiles(updatedProfiles);
  };
  
  // Create a new profile
  const createNewProfile = () => {
    if (!newProfileName.trim()) {
      toast({
        title: "Profile Name Required",
        description: "Please enter a name for your new sound profile.",
        variant: "destructive"
      });
      return;
    }
    
    const newProfile: SoundProfile = {
      id: `profile-${Date.now()}`,
      name: newProfileName,
      configurations: JSON.parse(JSON.stringify(DEFAULT_PROFILE.configurations)), // Deep copy
      isActive: false
    };
    
    setProfiles([...profiles, newProfile]);
    setNewProfileName("");
    
    toast({
      title: "Profile Created",
      description: `New sound profile "${newProfileName}" has been created.`,
      variant: "default"
    });
  };
  
  // Activate a profile
  const activateProfile = (profileId: string) => {
    const updatedProfiles = profiles.map(profile => ({
      ...profile,
      isActive: profile.id === profileId
    }));
    
    setProfiles(updatedProfiles);
    const newActiveProfile = updatedProfiles.find(p => p.id === profileId);
    if (newActiveProfile) {
      setActiveProfile(newActiveProfile);
    }
    
    toast({
      title: "Profile Activated",
      description: `Sound profile "${newActiveProfile?.name}" is now active.`,
      variant: "default"
    });
  };
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-2xl font-bold text-[#6A1B9A] mb-6">Personalized Alert Soundscape Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profiles */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Sound Profiles</CardTitle>
                <CardDescription>Create and manage alert sound profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profiles.map(profile => (
                    <div key={profile.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{profile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                      {!profile.isActive ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => activateProfile(profile.id)}
                        >
                          Activate
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="border border-green-500 text-green-600"
                          disabled
                        >
                          Active
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <Label htmlFor="new-profile">Create New Profile</Label>
                    <div className="flex mt-2">
                      <Input 
                        id="new-profile" 
                        placeholder="Profile name" 
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        className="mr-2"
                      />
                      <Button onClick={createNewProfile}>Create</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Profile</CardTitle>
                <CardDescription>Currently active: {activeProfile.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">When alerts trigger, sounds will play according to these settings:</p>
                  
                  {ALERT_CATEGORIES.map(category => {
                    const config = activeProfile.configurations[category.id];
                    return (
                      <div key={category.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {ALERT_SOUND_TYPES.find(s => s.id === config.soundType)?.name}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs mr-2">Vol: {config.volume}%</span>
                          <Switch 
                            checked={config.enabled} 
                            onCheckedChange={(checked) => {
                              updateProfileConfig(category.id, 'enabled', checked);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  
                  <Button 
                    className="w-full bg-[#6A1B9A] hover:bg-[#6A1B9A]/90 text-white" 
                    onClick={() => {
                      // Profiles are automatically saved to localStorage on every change
                      // This button provides user feedback
                      try {
                        localStorage.setItem("nestara_sound_profiles", JSON.stringify(profiles));
                        toast({
                          title: "Settings Saved",
                          description: "Your alert sound profile has been saved to your device.",
                          variant: "default"
                        });
                      } catch (error) {
                        console.error("Error saving sound profiles:", error);
                        toast({
                          title: "Error Saving Settings",
                          description: "Could not save your sound profiles to local storage.",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Sound Configuration */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Alert Sound Customization</CardTitle>
                <CardDescription>Configure how each type of alert sounds</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full justify-start mb-6">
                    {ALERT_CATEGORIES.map(category => (
                      <TabsTrigger 
                        key={category.id}
                        value={category.id}
                        className="flex-1"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {ALERT_CATEGORIES.map(category => {
                    const config = activeProfile.configurations[category.id];
                    return (
                      <TabsContent key={category.id} value={category.id} className="space-y-6">
                        <div>
                          <p className="text-sm mb-6">{category.description}</p>
                          
                          <div className="space-y-6">
                            <div>
                              <Label>Sound Type</Label>
                              <Select 
                                value={config.soundType}
                                onValueChange={(value) => {
                                  updateProfileConfig(category.id, "soundType", value);
                                }}
                              >
                                <SelectTrigger className="mt-2">
                                  <SelectValue placeholder="Select a sound type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ALERT_SOUND_TYPES.map(type => (
                                    <SelectItem key={type.id} value={type.id}>
                                      {type.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground mt-2">
                                {ALERT_SOUND_TYPES.find(t => t.id === config.soundType)?.description}
                              </p>
                            </div>
                            
                            <div>
                              <div className="flex justify-between">
                                <Label>Volume ({config.volume}%)</Label>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => playPreviewSound(config.soundType, config.volume)}
                                >
                                  Test Sound
                                </Button>
                              </div>
                              <Slider
                                className="mt-2"
                                min={0}
                                max={100}
                                step={5}
                                value={[config.volume]}
                                onValueChange={(value) => {
                                  updateProfileConfig(category.id, "volume", value[0]);
                                }}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label>Enabled</Label>
                                <p className="text-xs text-muted-foreground">Turn sound on/off for this alert type</p>
                              </div>
                              <Switch 
                                checked={config.enabled}
                                onCheckedChange={(checked) => {
                                  updateProfileConfig(category.id, 'enabled', checked);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>How Alert Sounds Work</CardTitle>
                <CardDescription>Understanding alert sound priority and behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-red-100 text-red-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Priority System</h3>
                      <p className="text-sm">When multiple alerts trigger simultaneously, they'll play in order of urgency: Urgent → Attention → Gentle.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-yellow-100 text-yellow-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Sound Repetition</h3>
                      <p className="text-sm">Critical alerts will repeat at appropriate intervals until acknowledged or resolved. Non-critical alerts play once.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Time-Sensitive Behavior</h3>
                      <p className="text-sm">During quiet hours (configurable in Settings), non-urgent alerts will use a reduced volume level.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Multiple Profiles</h3>
                      <p className="text-sm">Create different profiles for day/night shifts or different care units. Only one profile can be active at a time.</p>
                    </div>
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