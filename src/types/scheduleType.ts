import { Link } from "./linkType";

export interface Schedule {
  id: string;
  enterpriseUrlId: string;
  dateTime: string | Date;
  active: boolean;
  enterpriseUrl?: Link;
}

export interface CreateSchedulePayload {
  enterpriseUrlId: string;
  dateTime: string | Date;
}

export interface UpdateSchedulePayload {
  enterpriseUrlId?: string;
  dateTime?: string | Date;
  active?: boolean;
}
