export interface ScheduleAppointmentFilterhResponse {
  id: number
  start_At?: string
  end_At?: string
  status?: string
  year?: number
  month?:any
  scheduledAppointments: ClientScheduleAppointementResponse[]
}

export interface ClientScheduleAppointementResponse {
  id: number
  day: number
  startAt: Date
  endAt: Date
  clientId: number
  clientName: string
  barbeiroId: number
  barbeiroName: string
  status: string
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
