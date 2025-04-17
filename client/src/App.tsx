import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

// Import pages
import Dashboard from "@/pages/dashboard";
import UnitDetail from "@/pages/unit-detail";
import AlertHistory from "@/pages/alert-history";
import CompatibleItems from "@/pages/compatible-items";
import Settings from "@/pages/settings";
import SoundscapeGenerator from "@/pages/soundscape-generator";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/unit/:id" component={UnitDetail} />
      <Route path="/alerts" component={AlertHistory} />
      <Route path="/items" component={CompatibleItems} />
      <Route path="/settings" component={Settings} />
      <Route path="/soundscape" component={SoundscapeGenerator} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
