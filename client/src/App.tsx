import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/layout/Layout";

import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import Machines from "@/pages/Machines";
import MachineDetail from "@/pages/MachineDetail";
import Analytics from "@/pages/Analytics";
import Maintenance from "@/pages/Maintenance";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import ModelMonitoring from "@/pages/ModelMonitoring";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public Landing Page */}
      <Route path="/" component={LandingPage} />

      {/* Operational Console (Rendered inside Dashboard Layout) */}
      <Route path="/dashboard">
        <Layout>
          <Dashboard />
        </Layout>
      </Route>

      <Route path="/machines">
        <Layout>
          <Machines />
        </Layout>
      </Route>

      <Route path="/machines/:id">
        <Layout>
          <MachineDetail />
        </Layout>
      </Route>

      <Route path="/analytics">
        <Layout>
          <Analytics />
        </Layout>
      </Route>

      <Route path="/maintenance">
        <Layout>
          <Maintenance />
        </Layout>
      </Route>

      <Route path="/alerts">
        <Layout>
          <Alerts />
        </Layout>
      </Route>

      <Route path="/reports">
        <Layout>
          <Reports />
        </Layout>
      </Route>

      <Route path="/models">
        <Layout>
          <ModelMonitoring />
        </Layout>
      </Route>

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
