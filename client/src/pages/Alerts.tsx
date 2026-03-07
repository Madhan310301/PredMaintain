import { useAlerts, useAcknowledgeAlert } from "@/hooks/use-alerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, AlertTriangle, AlertOctagon, Info, CheckCircle, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Alerts() {
  const { data: alerts, isLoading } = useAlerts();
  const { mutate: acknowledge } = useAcknowledgeAlert();
  const [tab, setTab] = useState("active");

  const active = alerts?.filter((a) => !a.acknowledged) || [];
  const acknowledged = alerts?.filter((a) => a.acknowledged) || [];
  const critical = active.filter((a) => a.severity === "critical");
  const warnings = active.filter((a) => a.severity === "warning");

  const displayAlerts = tab === "active" ? active : acknowledged;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Alerts</h1>
          <p className="text-muted-foreground text-sm">System alerts and notifications</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AlertStat icon={AlertOctagon} label="Critical" value={critical.length} color="text-rose-500" />
        <AlertStat icon={AlertTriangle} label="Warnings" value={warnings.length} color="text-amber-500" />
        <AlertStat icon={Bell} label="Total Active" value={active.length} color="text-blue-500" />
        <AlertStat icon={CheckCircle} label="Acknowledged" value={acknowledged.length} color="text-emerald-500" />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-card/50">
          <TabsTrigger value="active" className="text-xs gap-1.5">
            Active
            {active.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-bold">
                {active.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="acknowledged" className="text-xs">Acknowledged</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Sev</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Machine</TableHead>
                <TableHead>Sensor</TableHead>
                <TableHead>Time</TableHead>
                {tab === "active" && <TableHead className="w-24">Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading alerts...</TableCell>
                </TableRow>
              ) : displayAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    {tab === "active" ? "No active alerts — all systems normal" : "No acknowledged alerts"}
                  </TableCell>
                </TableRow>
              ) : (
                displayAlerts.map((alert) => (
                  <TableRow key={alert.id} className={cn(
                    alert.severity === "critical" && !alert.acknowledged && "bg-rose-950/10"
                  )}>
                    <TableCell>
                      {alert.severity === "critical" ? (
                        <AlertOctagon className="w-4 h-4 text-rose-500" />
                      ) : alert.severity === "warning" ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-sm max-w-[250px] truncate">{alert.message}</TableCell>
                    <TableCell className="text-sm">{alert.machineName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{alert.sensor}</Badge>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                      {format(new Date(alert.timestamp), "MMM dd, HH:mm")}
                    </TableCell>
                    {tab === "active" && (
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs gap-1"
                          onClick={() => acknowledge(alert.id)}
                        >
                          <Check className="w-3 h-3" /> Ack
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AlertStat({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="p-4 bg-card/50 border-border/50">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-background/50 border border-border/50 ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">{label}</p>
          <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
        </div>
      </div>
    </Card>
  );
}
