import { useMaintenanceRecords, useCreateMaintenanceRecord } from "@/hooks/use-maintenance";
import { useMachines } from "@/hooks/use-machines";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Wrench, Plus, DollarSign, Clock, Calendar } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Maintenance() {
  const { data: records, isLoading } = useMaintenanceRecords();
  const { data: machines } = useMachines();
  const [filterType, setFilterType] = useState<string>("all");
  const [filterMachine, setFilterMachine] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!records) return [];
    return records.filter((r) => {
      const matchType = filterType === "all" || r.type === filterType;
      const matchMachine = filterMachine === "all" || r.machineId.toString() === filterMachine;
      return matchType && matchMachine;
    });
  }, [records, filterType, filterMachine]);

  const totalCost = filtered.reduce((sum, r) => sum + r.cost, 0);
  const avgCost = filtered.length > 0 ? totalCost / filtered.length : 0;
  const totalHours = filtered.reduce((sum, r) => sum + r.durationHours, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Maintenance Logs</h1>
            <p className="text-muted-foreground text-sm">{filtered.length} records</p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Maintenance</DialogTitle>
            </DialogHeader>
            <AddMaintenanceForm machines={machines || []} onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SumCard icon={DollarSign} label="Total Cost" value={`$${totalCost.toFixed(0)}`} color="text-emerald-500" />
        <SumCard icon={DollarSign} label="Avg Cost" value={`$${avgCost.toFixed(0)}`} color="text-blue-500" />
        <SumCard icon={Clock} label="Total Hours" value={`${totalHours.toFixed(1)}h`} color="text-amber-500" />
        <SumCard icon={Calendar} label="Records" value={`${filtered.length}`} color="text-purple-500" />
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="preventive">Preventive</SelectItem>
            <SelectItem value="corrective">Corrective</SelectItem>
            <SelectItem value="predictive">Predictive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterMachine} onValueChange={setFilterMachine}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Machine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Machines</SelectItem>
            {machines?.map((m) => (
              <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Machine</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">Loading records...</TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No records found.</TableCell>
                </TableRow>
              ) : (
                filtered.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="text-sm whitespace-nowrap">
                      {format(new Date(record.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium text-sm max-w-[160px] truncate">{record.machineName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px]",
                        record.type === "predictive" ? "border-purple-500/50 text-purple-400" :
                        record.type === "corrective" ? "border-rose-500/50 text-rose-400" :
                        "border-blue-500/50 text-blue-400"
                      )}>
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{record.description}</TableCell>
                    <TableCell className="text-sm">{record.technician}</TableCell>
                    <TableCell className="text-sm">{record.durationHours.toFixed(1)}h</TableCell>
                    <TableCell className="text-right font-mono text-sm">${record.cost.toFixed(0)}</TableCell>
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

function SumCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="p-4 bg-card/50 border-border/50">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-background/50 border border-border/50 ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">{label}</p>
          <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
        </div>
      </div>
    </Card>
  );
}

function AddMaintenanceForm({ machines, onSuccess }: { machines: any[]; onSuccess: () => void }) {
  const { mutate, isPending } = useCreateMaintenanceRecord();
  const { toast } = useToast();
  const [form, setForm] = useState({
    machineId: machines[0]?.id || 1,
    machineName: machines[0]?.name || "",
    type: "preventive" as const,
    description: "",
    technician: "",
    cost: 0,
    durationHours: 1,
    partsReplaced: [] as string[],
    date: new Date().toISOString(),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => {
        toast({ title: "Record Created", description: "Maintenance logged." });
        onSuccess();
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      },
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label>Machine</Label>
        <Select
          value={form.machineId.toString()}
          onValueChange={(v) => {
            const m = machines.find((m: any) => m.id.toString() === v);
            setForm({ ...form, machineId: parseInt(v), machineName: m?.name || "" });
          }}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {machines.map((m: any) => (
              <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="preventive">Preventive</SelectItem>
              <SelectItem value="corrective">Corrective</SelectItem>
              <SelectItem value="predictive">Predictive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Cost ($)</Label>
          <Input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })} />
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What was done?" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Technician</Label>
          <Input value={form.technician} onChange={(e) => setForm({ ...form, technician: e.target.value })} />
        </div>
        <div>
          <Label>Duration (hrs)</Label>
          <Input type="number" step="0.5" value={form.durationHours} onChange={(e) => setForm({ ...form, durationHours: parseFloat(e.target.value) || 0 })} />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : "Log Maintenance"}
      </Button>
    </form>
  );
}
