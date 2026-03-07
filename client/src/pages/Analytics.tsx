import { useMachines } from "@/hooks/use-machines";
import { useFleetSummary } from "@/hooks/use-reports";
import { useMaintenanceRecords } from "@/hooks/use-maintenance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, TrendingUp, Activity, DollarSign } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6366f1", "#8b5cf6", "#ec4899"];

export default function Analytics() {
  const { data: machines } = useMachines();
  const { data: fleet } = useFleetSummary();
  const { data: maintenance } = useMaintenanceRecords();

  // Status distribution pie data
  const statusData = [
    { name: "Healthy", value: fleet?.healthyCount || 0, color: "#10b981" },
    { name: "Warning", value: fleet?.warningCount || 0, color: "#f59e0b" },
    { name: "Critical", value: fleet?.criticalCount || 0, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  // Machine type distribution
  const typeDistribution = (() => {
    if (!machines) return [];
    const counts: Record<string, number> = {};
    machines.forEach((m) => { counts[m.type] = (counts[m.type] || 0) + 1; });
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  })();

  // Maintenance cost by type
  const costByType = (() => {
    if (!maintenance) return [];
    const costs: Record<string, number> = {};
    maintenance.forEach((m) => { costs[m.type] = (costs[m.type] || 0) + m.cost; });
    return Object.entries(costs).map(([type, cost]) => ({ type, cost: Math.round(cost) }));
  })();

  // Runtime comparison
  const runtimeData = machines?.map((m) => ({
    name: m.name.length > 15 ? m.name.substring(0, 15) + "…" : m.name,
    runtime: Math.round(m.totalRuntimeHours),
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
          <BarChart2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm">Fleet-wide performance metrics and insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Machine Status Distribution */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> Machine Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={55}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={{ stroke: "rgba(255,255,255,0.2)" }}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Health Comparison */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Department Health
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {fleet?.departmentHealth && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fleet.departmentHealth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="department" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="healthScore" name="Health Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="machineCount" name="Machines" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Runtime Comparison */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" /> Machine Runtime Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={runtimeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} width={120} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="runtime" name="Runtime (h)" fill="#f59e0b" radius={[0, 4, 4, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Maintenance Cost by Type */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Maintenance Cost by Type
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="type" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} formatter={(value: any) => [`$${value}`, "Cost"]} />
                <Bar dataKey="cost" name="Cost ($)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Machine Type Distribution */}
        <Card className="lg:col-span-2 bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-500" /> Equipment Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="type" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]} maxBarSize={50}>
                  {typeDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
