import { useQuery } from "@tanstack/react-query";
import type { FleetSummary } from "@shared/schema";

export function useFleetSummary() {
  return useQuery<FleetSummary>({
    queryKey: ["fleet-summary"],
    queryFn: async () => {
      const res = await fetch("/api/reports/fleet-summary");
      if (!res.ok) throw new Error("Failed to fetch fleet summary");
      return res.json();
    },
    refetchInterval: 10000,
  });
}
