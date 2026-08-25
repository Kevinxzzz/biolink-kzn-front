import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "@/service/scheduleService";
import type { CreateSchedulePayload, UpdateSchedulePayload } from "@/types/scheduleType";

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateSchedulePayload) => scheduleService.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });

  return {
    create: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSchedulePayload }) =>
      scheduleService.updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });

  return {
    update: (id: string, data: UpdateSchedulePayload) => mutation.mutateAsync({ id, data }),
    isUpdating: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
