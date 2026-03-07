import { useMachines, useCreateMachine } from "@/hooks/use-machines";
import { MachineCard } from "@/components/MachineCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Machines() {
  const { data: machines, isLoading } = useMachines();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const departments = useMemo(() => {
    if (!machines) return [];
    return ["All", ...new Set(machines.map((m) => m.department))];
  }, [machines]);

  const [activeDept, setActiveDept] = useState("All");

  const filtered = useMemo(() => {
    if (!machines) return [];
    return machines.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.type.toLowerCase().includes(search.toLowerCase()) ||
        m.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || m.status === statusFilter;
      const matchDept = activeDept === "All" || m.department === activeDept;
      return matchSearch && matchStatus && matchDept;
    });
  }, [machines, search, statusFilter, activeDept]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Machine Inventory</h2>
          <p className="text-muted-foreground text-sm">
            {machines?.length || 0} machines • {filtered.length} shown
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search machines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Machine */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Add Machine
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Machine</DialogTitle>
              </DialogHeader>
              <CreateMachineForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Department Tabs */}
      <Tabs value={activeDept} onValueChange={setActiveDept}>
        <TabsList className="bg-card/50">
          {departments.map((dept) => (
            <TabsTrigger key={dept} value={dept} className="text-xs">
              {dept}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading inventory...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-card/30 rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground">No machines match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      )}
    </div>
  );
}

function CreateMachineForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutate, isPending } = useCreateMachine();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    type: "CNC Mill",
    location: "Building A",
    department: "CNC Machining",
    manufacturer: "",
    modelNumber: "",
    installDate: new Date().toISOString().split("T")[0],
    lastMaintenanceDate: new Date().toISOString().split("T")[0],
    maintenanceIntervalDays: 90,
    criticality: "medium" as const,
    status: "healthy" as const,
    totalRuntimeHours: 0,
    specifications: { maxTemp: 85, maxVibration: 3.0, maxCurrent: 25, maxPressure: 100, maxHumidity: 80, maxRpm: 5000 },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => {
        toast({ title: "Machine Created", description: "New equipment added to inventory." });
        onSuccess();
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      },
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div>
        <Label>Machine Name</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. CNC-001" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["CNC Mill", "Lathe", "Conveyor", "Robotic Arm", "Press", "Compressor", "Pump", "Welder"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Department</Label>
          <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["CNC Machining", "Assembly", "Welding", "Packaging", "Utilities"].map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Location</Label>
          <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <div>
          <Label>Criticality</Label>
          <Select value={form.criticality} onValueChange={(v: any) => setForm({ ...form, criticality: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Manufacturer</Label>
          <Input value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} />
        </div>
        <div>
          <Label>Model #</Label>
          <Input value={form.modelNumber} onChange={(e) => setForm({ ...form, modelNumber: e.target.value })} />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Create Machine"}
      </Button>
    </form>
  );
}
