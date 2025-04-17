import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", password: "", confirmPassword: "", displayName: "" });
  const [error, setError] = useState("");

  // Redirect if already authenticated
  if (isAuthenticated) {
    setLocation("/");
    return null;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!loginData.username || !loginData.password) {
      setError("Please enter both username and password");
      return;
    }
    
    const success = await login(loginData.username, loginData.password);
    if (success) {
      setLocation("/");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!registerData.username || !registerData.password || !registerData.confirmPassword) {
      setError("Please fill out all required fields");
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerData.username,
          password: registerData.password,
          displayName: registerData.displayName || null,
          role: 'user'
        }),
      });
      
      if (response.ok) {
        // Login after successful registration
        await login(registerData.username, registerData.password);
        setLocation("/");
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        setError(errorData.message || 'Registration failed');
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-800 to-indigo-900 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-6">Nestara</h1>
          <p className="text-purple-200 text-xl mb-8">
            Advanced neonatal transport monitoring platform
          </p>
          <div className="space-y-4 text-purple-100">
            <p className="flex items-center">
              <span className="mr-2">✓</span> Real-time temperature and vibration monitoring
            </p>
            <p className="flex items-center">
              <span className="mr-2">✓</span> Alert notifications via watch and Teams
            </p>
            <p className="flex items-center">
              <span className="mr-2">✓</span> Comprehensive equipment management
            </p>
            <p className="flex items-center">
              <span className="mr-2">✓</span> Detailed transport analytics
            </p>
          </div>
        </div>
        <div className="mt-auto">
          <p className="text-sm text-purple-200">
            © {new Date().getFullYear()} Nestara. All rights reserved.
          </p>
        </div>
      </div>

      {/* Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md relative">
          <div className="absolute w-full h-full bg-gradient-to-r from-purple-100/20 via-purple-200/20 to-purple-100/20 rounded-xl -top-1 -left-1 -z-10 blur-xl"></div>
          <div className="p-1 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200 rounded-xl">
            <Card className="w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F3E5F5]/0 via-[#E1BEE7]/0 to-[#F3E5F5]/0 opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
              <CardHeader className="bg-white dark:bg-gray-950 rounded-t-lg">
                <CardTitle className="text-2xl text-center text-purple-900 dark:text-purple-100">Welcome to Nestara</CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Secure access to the neonatal transport platform
                </CardDescription>
              </CardHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                </div>
                
                <CardContent className="pt-4">
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLoginSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-username">Username</Label>
                          <Input 
                            id="login-username" 
                            type="text" 
                            placeholder="Enter your username"
                            value={loginData.username}
                            onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password">Password</Label>
                          <Input 
                            id="login-password" 
                            type="password" 
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                            disabled={isLoading}
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-purple-700 hover:bg-purple-800 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</>
                          ) : (
                            "Login"
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={handleRegisterSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-username">Username</Label>
                          <Input 
                            id="register-username" 
                            type="text" 
                            placeholder="Choose a username"
                            value={registerData.username}
                            onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-display-name">Display Name (optional)</Label>
                          <Input 
                            id="register-display-name" 
                            type="text" 
                            placeholder="Your name"
                            value={registerData.displayName}
                            onChange={(e) => setRegisterData({...registerData, displayName: e.target.value})}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password">Password</Label>
                          <Input 
                            id="register-password" 
                            type="password" 
                            placeholder="Choose a password"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-confirm-password">Confirm Password</Label>
                          <Input 
                            id="register-confirm-password" 
                            type="password" 
                            placeholder="Confirm password"
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                            disabled={isLoading}
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-purple-700 hover:bg-purple-800 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                          ) : (
                            "Register"
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </CardContent>
                
                <CardFooter className="flex justify-center text-center text-sm text-muted-foreground">
                  <p>
                    {activeTab === "login" 
                      ? "Don't have an account? Click Register above." 
                      : "Already have an account? Click Login above."}
                  </p>
                </CardFooter>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}