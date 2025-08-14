import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Import pages
import Dashboard from "@/pages/dashboard";
import UnitDetail from "@/pages/unit-detail";
import AlertHistory from "@/pages/alert-history-new";
import CompatibleItems from "@/pages/compatible-items";
import Settings from "@/pages/settings-new";
import SoundscapeGenerator from "@/pages/soundscape-generator";
import TransportIcons from "@/pages/transport-icons";
import MobileMeasurements from "@/pages/mobile-measurements";
import PrivacyPolicyPage from "@/pages/privacy-policy-page";
import TermsOfServicePage from "@/pages/terms-of-service-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/unit/:id" component={UnitDetail} />
      <ProtectedRoute path="/alerts" component={AlertHistory} />
      <ProtectedRoute path="/items" component={CompatibleItems} />
      <ProtectedRoute path="/settings" component={Settings} />
      <ProtectedRoute path="/soundscape" component={SoundscapeGenerator} />
      <ProtectedRoute path="/transport-icons" component={TransportIcons} />
      <ProtectedRoute path="/mobile-measurements" component={MobileMeasurements} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppSettingsProvider>
          <Router />
          <Toaster />
        </AppSettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
