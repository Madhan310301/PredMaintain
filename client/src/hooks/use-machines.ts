import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Machine, SensorReading, AnalysisReport } from "@shared/schema";

// ================= MACHINES =================

export function useMachines() {
  return useQuery<Machine[]>({
    queryKey: ["machines"],
    queryFn: async () => {
      const res = await fetch("/api/machines");
      if (!res.ok) throw new Error("Failed to fetch machines");
      return res.json();
    },
    refetchInterval: 3000,
  });
}

export function useMachine(id: number) {
  return useQuery<Machine>({
    queryKey: ["machine", id],
    queryFn: async () => {
      const res = await fetch(`/api/machines/${id}`);
      if (!res.ok) throw new Error("Failed to fetch machine");
      return res.json();
    },
    enabled: !!id,
    refetchInterval: 2000,
  });
}

export function useCreateMachine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/machines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create machine");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
    },
  });
}

// ================= READINGS =================

export function useMachineReadings(id: number, limit: number = 50) {
  return useQuery<SensorReading[]>({
    queryKey: ["readings", id, limit],
    queryFn: async () => {
      const res = await fetch(`/api/machines/${id}/readings?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch readings");
      return res.json();
    },
    enabled: !!id,
    refetchInterval: 1000,
  });
}

// ================= AI ANALYSIS =================

export function useAnalyzeMachine() {
  const queryClient = useQueryClient();
  return useMutation<AnalysisReport, Error, number>({
    mutationFn: async (machineId: number) => {
      const res = await fetch(`/api/machines/${machineId}/analyze`, { method: "POST" });
      if (!res.ok) throw new Error("Analysis failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["machines"] });
    },
  });
}

export function useAnalysisHistory(machineId: number) {
  return useQuery<AnalysisReport[]>({
    queryKey: ["analysis-history", machineId],
    queryFn: async () => {
      const res = await fetch(`/api/machines/${machineId}/analysis-history`);
      if (!res.ok) throw new Error("Failed to fetch analysis history");
      return res.json();
    },
    enabled: !!machineId,
  });
}

// ================= SIMULATION =================

export function useToggleSimulation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (running: boolean) => {
      const res = await fetch("/api/simulation/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ running }),
      });
      if (!res.ok) throw new Error("Failed to toggle simulation");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
