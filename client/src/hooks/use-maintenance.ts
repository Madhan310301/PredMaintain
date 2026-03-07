import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { MaintenanceRecord } from "@shared/schema";

export function useMaintenanceRecords(machineId?: number) {
  return useQuery<MaintenanceRecord[]>({
    queryKey: ["maintenance", machineId],
    queryFn: async () => {
      const url = machineId ? `/api/maintenance?machineId=${machineId}` : "/api/maintenance";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch maintenance records");
      return res.json();
    },
    refetchInterval: 10000,
  });
}

export function useCreateMaintenanceRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<MaintenanceRecord, "id">) => {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create maintenance record");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    },
  });
}
