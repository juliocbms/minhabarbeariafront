export interface ScheduleAppointementMonthModel {
  start_At: number
  end_At: number
  status: string
  scheduledAppointments: ClientScheduleAppointmentModel[]
}

export interface ClientScheduleAppointmentModel {
  id: number;
  clientName: string;
  clientId: number;
  barbeiroName: string;
  barbeiroId: number;
  day: Date;
  startAt: Date;
  endAt: Date;
  status: string;
}

export interface SaveScheduleModel {
  startAt?: string
  endAt?: string
  clientId?: number
  barbeiroId?: number
  status?: string
  data_agendamento?: string
}

export interface SelectClientModel {
  id: number
  name: string
  role: string
}
