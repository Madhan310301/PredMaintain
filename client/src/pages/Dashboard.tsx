import { useMachines } from "@/hooks/use-machines";
import { useFleetSummary } from "@/hooks/use-reports";
import { MachineCard } from "@/components/MachineCard";
import { AlertsFeed } from "@/components/AlertsFeed";
import { FleetHeatmap } from "@/components/FleetHeatmap";
import { PredictiveTimeline } from "@/components/PredictiveTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, Server, Brain, TrendingUp, DollarSign, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Dashboard() {
  const { data: machines, isLoading } = useMachines();
  const { data: fleet } = useFleetSummary();

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Total Machines" 
          value={fleet?.totalMachines || 0} 
          icon={Server} 
          trend={`${fleet?.averageUptime || 0}% uptime`}
          color="text-primary"
        />
        <StatCard 
          label="Healthy" 
          value={fleet?.healthyCount || 0} 
          icon={CheckCircle} 
          trend="Operating normally"
          color="text-emerald-500"
        />
        <StatCard 
          label="Warnings" 
          value={fleet?.warningCount || 0} 
          icon={AlertTriangle} 
          trend="Requires attention"
          color="text-amber-500"
        />
        <StatCard 
          label="Critical" 
          value={fleet?.criticalCount || 0} 
          icon={Activity} 
          trend="Immediate action"
          color="text-rose-500"
        />
      </div>

      {/* Executive Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MiniStat
          icon={Brain}
          label="Fleet Health"
          value={`${fleet?.averageHealthScore || 0}%`}
          color={
            (fleet?.averageHealthScore || 0) >= 70
              ? "text-emerald-500"
              : (fleet?.averageHealthScore || 0) >= 40
              ? "text-amber-500"
              : "text-rose-500"
          }
        />
        <MiniStat
          icon={AlertTriangle}
          label="Active Alerts"
          value={`${fleet?.totalAlerts || 0}`}
          color="text-amber-500"
        />
        <MiniStat
          icon={TrendingUp}
          label="Predicted Failures"
          value={`${fleet?.predictedFailuresThisWeek || 0} this week`}
          color="text-rose-400"
        />
        <MiniStat
          icon={DollarSign}
          label="Maintenance Cost"
          value={`$${((fleet?.totalMaintenanceCost || 0) / 1000).toFixed(1)}k`}
          color="text-blue-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Heatmap */}
        <Card className="lg:col-span-2 bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Fleet Health Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FleetHeatmap machines={machines || []} />
          </CardContent>
        </Card>

        {/* Alerts Feed */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Live Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AlertsFeed maxItems={8} className="h-[320px]" />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Timeline */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              Predicted Failure Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PredictiveTimeline machines={machines || []} />
          </CardContent>
        </Card>

        {/* Department Health Chart */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Department Health Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            {fleet?.departmentHealth && fleet.departmentHealth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fleet.departmentHealth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="department"
                    stroke="rgba(255,255,255,0.2)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.2)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar
                    dataKey="healthScore"
                    name="Health Score"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Loading department data...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, color }: any) {
  return (
    <Card className="p-5 border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
          <h3 className="text-3xl font-bold font-mono">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg bg-background/50 border border-border/50 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
        <span className={color}>{trend}</span>
      </p>
    </Card>
  );
}

function MiniStat({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="p-4 border-border/50 bg-card/50 backdrop-blur-sm flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-background/50 border border-border/50 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
        <p className={`text-sm font-bold font-mono ${color}`}>{value}</p>
      </div>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  );
}
