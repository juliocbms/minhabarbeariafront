export interface ScheduleAppointementMonthModel {
  start_At: number
  end_At: number
  status: string
  scheduledAppointments: ClientScheduleAppointmentModel[]
}

export interface ClientScheduleAppointmentModel {
  id: number;
  clientName: string;
  clienteId: number;
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
  clienteId?: number
  barbeiroId?: number
  status?: string
  dataAgendamento?: string
}

export interface SelectClientModel {
  id: number
  name: string
  role: string
}
