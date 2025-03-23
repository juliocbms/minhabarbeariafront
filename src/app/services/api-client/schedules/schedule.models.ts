export interface ScheduleAppointmentFilterhResponse {
  id: number
  dataInicio?: string
  dataFim?: string
  status?: string
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
  clientId: number
  barbeiroId: number
  status: string
}

export interface SaveScheduleRequest {
  startAt: Date
  endAt: Date
  clientId: number
  barbeiroId: number
  data_agendamento:Date
  status: string

}

export interface GetAppointmentsRequest {
  id: number;
  startAt: string;
  endAt: string;
  status: string;
}
