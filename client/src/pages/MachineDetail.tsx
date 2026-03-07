import { useMachine, useMachineReadings, useAnalyzeMachine, useAnalysisHistory } from "@/hooks/use-machines";
import { useMaintenanceRecords } from "@/hooks/use-maintenance";
import { useRoute } from "wouter";
import { SensorChart } from "@/components/SensorChart";
import { HealthGauge } from "@/components/HealthGauge";
import { RiskRadar } from "@/components/RiskRadar";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BrainCircuit, History, ArrowLeft, RefreshCw, AlertOctagon,
  Calendar, Wrench, TrendingUp, Clock, Shield
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { AnalysisReport } from "@shared/schema";

export default function MachineDetail() {
  const [match, params] = useRoute("/machines/:id");
  const id = parseInt(params?.id || "0");
  
  const { data: machine, isLoading: loadingMachine } = useMachine(id);
  const { data: readings, isLoading: loadingReadings } = useMachineReadings(id, 50);
  const { mutate: analyze, isPending: analyzing, data: analysis } = useAnalyzeMachine();
  const { data: analysisHist } = useAnalysisHistory(id);
  const { data: maintenance } = useMaintenanceRecords(id);
  
  if (loadingMachine) return <DetailSkeleton />;
  if (!machine) return <div>Machine not found</div>;

  const reversedReadings = readings ? [...readings].reverse() : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/machines">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {machine.name}
              <StatusBadge status={machine.status} />
            </h1>
            <p className="text-muted-foreground text-sm">
              {machine.type} • {machine.department} • {machine.location} • Runtime: {machine.totalRuntimeHours.toFixed(0)}h
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => analyze(id)} 
            disabled={analyzing}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/20"
          >
            {analyzing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <BrainCircuit className="w-4 h-4 mr-2" />
            )}
            Run AI Analysis
          </Button>
        </div>
      </div>

      {/* Machine Info Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <InfoChip icon={Shield} label="Criticality" value={machine.criticality.toUpperCase()} />
        <InfoChip icon={Wrench} label="Manufacturer" value={machine.manufacturer} />
        <InfoChip icon={Calendar} label="Installed" value={machine.installDate} />
        <InfoChip icon={Calendar} label="Last Maint." value={machine.lastMaintenanceDate} />
        <InfoChip icon={Clock} label="Maint. Interval" value={`${machine.maintenanceIntervalDays}d`} />
      </div>

      {/* Analysis Result + Health Gauge + Risk Radar */}
      {analysis && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Analysis Report */}
            <Card className={cn(
              "lg:col-span-1 border-l-4",
              analysis.status === 'healthy' ? 'border-l-emerald-500' : 
              analysis.status === 'warning' ? 'border-l-amber-500' : 'border-l-rose-500'
            )}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <BrainCircuit className="w-4 h-4 text-purple-500" />
                  AI Diagnostic
                  <span className="text-[10px] font-normal text-muted-foreground ml-auto">
                    {(analysis.confidence * 100).toFixed(0)}% conf.
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{analysis.summary}</p>
                
                {analysis.predictedFailure && (
                  <div className="flex items-center gap-2 text-rose-400 bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/50 text-xs">
                    <AlertOctagon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-semibold">{analysis.predictedFailure}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <MetricBadge label="Failure Prob." value={`${(analysis.failureProbability * 100).toFixed(0)}%`}
                    color={analysis.failureProbability > 0.5 ? "text-rose-400" : "text-emerald-400"} />
                  <MetricBadge label="RUL" value={`${analysis.remainingUsefulLifeDays}d`}
                    color={analysis.remainingUsefulLifeDays < 10 ? "text-rose-400" : "text-emerald-400"} />
                  <MetricBadge label="Trend" value={analysis.trendDirection}
                    color={analysis.trendDirection === "degrading" ? "text-rose-400" : analysis.trendDirection === "improving" ? "text-emerald-400" : "text-blue-400"} />
                  <MetricBadge label="Anomalies" value={`${analysis.anomalies.length}`}
                    color={analysis.anomalies.length > 0 ? "text-amber-400" : "text-emerald-400"} />
                </div>

                <div>
                  <h4 className="text-[10px] font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Recommendations</h4>
                  <ul className="space-y-1">
                    {analysis.recommendations.slice(0, 4).map((rec: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Health Gauge */}
            <Card className="flex items-center justify-center bg-card/50">
              <HealthGauge score={analysis.overallHealthScore} size={220} />
            </Card>

            {/* Risk Radar */}
            <Card className="bg-card/50">
              <CardHeader className="pb-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Risk Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <RiskRadar sensorRisks={analysis.sensorRisks} height={250} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Sensor Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2 bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <History className="w-4 h-4" /> Live Temperature Telemetry
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <SensorChart data={reversedReadings} dataKey="temperature" color="#10b981" unit="°C" height={280} threshold={machine.specifications.maxTemp} />
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Vibration Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <SensorChart data={reversedReadings} dataKey="vibration" color="#f59e0b" unit="mm" threshold={machine.specifications.maxVibration} />
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Power Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <SensorChart data={reversedReadings} dataKey="current" color="#6366f1" unit="A" threshold={machine.specifications.maxCurrent} />
          </CardContent>
        </Card>

        {machine.specifications.maxPressure > 0 && (
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Pressure Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <SensorChart data={reversedReadings} dataKey="pressure" color="#ec4899" unit="psi" threshold={machine.specifications.maxPressure} />
            </CardContent>
          </Card>
        )}

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Humidity Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <SensorChart data={reversedReadings} dataKey="humidity" color="#06b6d4" unit="%" threshold={machine.specifications.maxHumidity} />
          </CardContent>
        </Card>

        {machine.specifications.maxRpm > 0 && (
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">RPM Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <SensorChart data={reversedReadings} dataKey="rpm" color="#a855f7" unit="" threshold={machine.specifications.maxRpm} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Analysis History & Recent Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analysis History */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-500" /> Analysis History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysisHist && analysisHist.length > 0 ? (
              <div className="space-y-2">
                {analysisHist.slice(0, 5).map((report: AnalysisReport, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-background/30 border border-border/30">
                    <StatusBadge status={report.status} showLabel={false} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">Health: {report.overallHealthScore}% • Failure: {(report.failureProbability * 100).toFixed(0)}%</p>
                      <p className="text-[10px] text-muted-foreground">{format(new Date(report.timestamp), "MMM dd, HH:mm")}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {report.trendDirection}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">Run AI Analysis to build history</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Maintenance */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-500" /> Recent Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {maintenance && maintenance.length > 0 ? (
              <div className="space-y-2">
                {maintenance.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-background/30 border border-border/30">
                    <Badge variant="outline" className={cn("text-[10px]",
                      record.type === "predictive" ? "border-purple-500/50 text-purple-400" :
                      record.type === "corrective" ? "border-rose-500/50 text-rose-400" :
                      "border-blue-500/50 text-blue-400"
                    )}>
                      {record.type}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{record.description}</p>
                      <p className="text-[10px] text-muted-foreground">{record.technician} • ${record.cost.toFixed(0)}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {format(new Date(record.date), "MMM dd")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No maintenance records</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoChip({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-card/50 border border-border/50">
      <Icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-xs font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function MetricBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-2 rounded-lg bg-background/30 border border-border/30 text-center">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={cn("text-sm font-bold font-mono", color)}>{value}</p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-20 bg-card rounded-xl animate-pulse" />
      <div className="grid grid-cols-5 gap-3">
        {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14 rounded-lg" />)}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <div className="h-64 bg-card rounded-xl animate-pulse" />
    </div>
  );
}
