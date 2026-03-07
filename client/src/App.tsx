import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/layout/Layout";

import Dashboard from "@/pages/Dashboard";
import Machines from "@/pages/Machines";
import MachineDetail from "@/pages/MachineDetail";
import Analytics from "@/pages/Analytics";
import Maintenance from "@/pages/Maintenance";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/machines" component={Machines} />
      <Route path="/machines/:id" component={MachineDetail} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/maintenance" component={Maintenance} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/reports" component={Reports} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
