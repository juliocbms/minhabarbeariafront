import { Injectable } from '@angular/core';
import { IScheduleService } from './ischedule.service';
import { Observable } from 'rxjs';
import { ClientScheduleAppointmentResponse, GetAppointmentsRequest, SaveScheduleRequest, SaveScheduleResponse, ScheduleAppointmentFilterhResponse } from './schedule.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClientScheduleAppointmentModel } from '../../../schedules/schedule.models';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService implements IScheduleService {

  private readonly basePath = environment.apiUrl

  constructor(private http: HttpClient) { }

  save(request: SaveScheduleRequest): Observable<SaveScheduleResponse> {
    return this.http.post<SaveScheduleResponse>(`${this.basePath}schedules`, request)
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}schedules/${id}`)
  }
  listInMonth(year: number, month: number): Observable<ScheduleAppointmentFilterhResponse> {
    return this.http.get<ScheduleAppointmentFilterhResponse>(`${this.basePath}schedules/${year}/${month}`)
  }

  getAppointments(request: GetAppointmentsRequest): Observable<ClientScheduleAppointmentResponse[]> {
    return this.http.get<ClientScheduleAppointmentResponse[]>(
      `${this.basePath}agendamentos/clients/inicio/${request.id}?dataInicio=${request.startAt}&dataFim=${request.endAt}&status=PENDENTE`
    );
  }

}
