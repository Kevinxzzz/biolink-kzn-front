import { useQuery } from "@tanstack/react-query";
import { scheduleService } from "@/service/scheduleService";

export function useSchedules() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["schedules"],
    queryFn: scheduleService.getSchedules,
    refetchOnMount: true,
  });

  return {
    schedules: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
