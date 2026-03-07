import { useMachines } from "@/hooks/use-machines";
import { useFleetSummary } from "@/hooks/use-reports";
import { useMaintenanceRecords } from "@/hooks/use-maintenance";
import { useAlerts } from "@/hooks/use-alerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { FileText, TrendingUp, Shield, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Reports() {
  const { data: machines } = useMachines();
  const { data: fleet } = useFleetSummary();
  const { data: maintenance } = useMaintenanceRecords();
  const { data: alerts } = useAlerts();

  const activeAlerts = alerts?.filter((a) => !a.acknowledged) || [];
  const criticalMachines = machines?.filter((m) => m.status === "critical") || [];
  const warningMachines = machines?.filter((m) => m.status === "warning") || [];

  const totalMaintenanceCost = maintenance?.reduce((sum, r) => sum + r.cost, 0) || 0;
  const predictiveCount = maintenance?.filter((m) => m.type === "predictive").length || 0;
  const correctiveCount = maintenance?.filter((m) => m.type === "corrective").length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Fleet Report</h1>
          <p className="text-muted-foreground text-sm">Comprehensive system health overview</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <ReportMetric label="Fleet Health" value={`${fleet?.averageHealthScore || 0}%`} icon={Shield}
          color={(fleet?.averageHealthScore || 0) >= 70 ? "text-emerald-500" : "text-amber-500"} />
        <ReportMetric label="Uptime" value={`${fleet?.averageUptime || 0}%`} icon={TrendingUp} color="text-blue-500" />
        <ReportMetric label="Active Alerts" value={`${activeAlerts.length}`} icon={AlertTriangle} color="text-amber-500" />
        <ReportMetric label="Critical" value={`${criticalMachines.length}`} icon={AlertTriangle} color="text-rose-500" />
        <ReportMetric label="Maint. Cost" value={`$${(totalMaintenanceCost / 1000).toFixed(1)}k`} icon={DollarSign} color="text-emerald-500" />
        <ReportMetric label="Predicted Failures" value={`${fleet?.predictedFailuresThisWeek || 0}`} icon={Shield} color="text-rose-400" />
      </div>

      {/* Machine Health Summary Table */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Machine Health Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criticality</TableHead>
                <TableHead>Runtime</TableHead>
                <TableHead>Last Maintenance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machines?.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell className="font-medium text-sm">{machine.name}</TableCell>
                  <TableCell className="text-sm">{machine.type}</TableCell>
                  <TableCell className="text-sm">{machine.department}</TableCell>
                  <TableCell><StatusBadge status={machine.status} /></TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[10px]",
                      machine.criticality === "high" ? "border-rose-500/50 text-rose-400" :
                      machine.criticality === "medium" ? "border-amber-500/50 text-amber-400" :
                      "border-blue-500/50 text-blue-400"
                    )}>
                      {machine.criticality}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-mono">{machine.totalRuntimeHours.toFixed(0)}h</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{machine.lastMaintenanceDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Issues */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Machines Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {[...criticalMachines, ...warningMachines].length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-sm">
                <CheckCircle className="w-8 h-8 mb-2 text-emerald-500/50" />
                All machines within normal parameters
              </div>
            ) : (
              <div className="space-y-2">
                {[...criticalMachines, ...warningMachines].map((machine) => (
                  <div key={machine.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/30 border border-border/30">
                    <StatusBadge status={machine.status} showLabel={false} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{machine.name}</p>
                      <p className="text-[10px] text-muted-foreground">{machine.department} • {machine.type}</p>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px]",
                      machine.criticality === "high" ? "border-rose-500/50 text-rose-400" : "border-amber-500/50 text-amber-400"
                    )}>
                      {machine.criticality} priority
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Maintenance Analysis */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Maintenance Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-background/30 border border-border/30 text-center">
                  <p className="text-[10px] text-muted-foreground">Total Records</p>
                  <p className="text-lg font-bold font-mono text-blue-400">{maintenance?.length || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-background/30 border border-border/30 text-center">
                  <p className="text-[10px] text-muted-foreground">Total Cost</p>
                  <p className="text-lg font-bold font-mono text-emerald-400">${totalMaintenanceCost.toFixed(0)}</p>
                </div>
                <div className="p-3 rounded-lg bg-background/30 border border-border/30 text-center">
                  <p className="text-[10px] text-muted-foreground">Predictive Actions</p>
                  <p className="text-lg font-bold font-mono text-purple-400">{predictiveCount}</p>
                </div>
                <div className="p-3 rounded-lg bg-background/30 border border-border/30 text-center">
                  <p className="text-[10px] text-muted-foreground">Corrective Actions</p>
                  <p className="text-lg font-bold font-mono text-rose-400">{correctiveCount}</p>
                </div>
              </div>

              {/* Department breakdown */}
              {fleet?.departmentHealth && (
                <div>
                  <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Department Scores</h4>
                  <div className="space-y-2">
                    {fleet.departmentHealth.map((dept) => (
                      <div key={dept.department} className="flex items-center gap-3">
                        <span className="text-xs w-28 truncate">{dept.department}</span>
                        <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all",
                              dept.healthScore >= 70 ? "bg-emerald-500" :
                              dept.healthScore >= 40 ? "bg-amber-500" : "bg-rose-500"
                            )}
                            style={{ width: `${dept.healthScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono w-10 text-right">{dept.healthScore}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportMetric({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="p-3 bg-card/50 border-border/50 text-center">
      <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
      <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </Card>
  );
}
