export interface ScheduleAppointmentFilterhResponse {
  year?: number
  month?: number
  scheduledAppointments: ClientScheduleAppointmentResponse[]
}

export interface ClientScheduleAppointmentResponse {
  id: number;
  barbeiro: {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
  };
  cliente: {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
  };
  dataAgendamento: string;
  dataCadastro: string;
  startAt: number;
  endAt: number;
  status: string;
}

export interface SaveScheduleResponse {
  id: number
  startAt: Date
  endAt: Date
  clienteId: number
  barbeiroId: number
  status: string
}

export interface SaveScheduleRequest {
  startAt: string
  endAt: string
  clienteId: number
  barbeiroId: number
  dataAgendamento:string
  status: string

}

export interface GetAppointmentsRequest {
  id: number;
  startAt: string;
  endAt: string;
  status: string;
}
