import { httpClient } from "./httpClient";
import type { Schedule, CreateSchedulePayload, UpdateSchedulePayload } from "@/types/scheduleType";

export const scheduleService = {
  async getSchedules(): Promise<Schedule[]> {
    const response = await httpClient.get<{ data: Schedule[] }>("/schedules");
    return response.data.data;
  },

  async createSchedule(data: CreateSchedulePayload): Promise<Schedule> {
    const response = await httpClient.post<{ data: Schedule }>("/schedules", data);
    return response.data.data;
  },

  async updateSchedule(id: string, data: UpdateSchedulePayload): Promise<Schedule> {
    const response = await httpClient.patch<{ data: Schedule }>(`/schedules/${id}`, data);
    return response.data.data;
  },

  async deleteSchedule(id: string): Promise<void> {
    await httpClient.delete(`/schedules/${id}`);
  }
};
