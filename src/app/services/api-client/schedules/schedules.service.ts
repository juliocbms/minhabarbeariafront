import { Injectable } from '@angular/core';
import { IScheduleService } from './ischedule.service';
import { catchError, Observable, of, throwError } from 'rxjs';
import { ClientScheduleAppointmentResponse, GetAppointmentsRequest, SaveScheduleRequest, SaveScheduleResponse, ScheduleAppointmentFilterhResponse } from './schedule.models';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SchedulesService implements IScheduleService {

  private readonly basePath = environment.apiUrl

  constructor(private http: HttpClient) { }

  save(request: SaveScheduleRequest): Observable<SaveScheduleResponse> {
    return this.http.post<SaveScheduleResponse>(`${this.basePath}agendamentos/save`, request)
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}agendamentos/${id}`)
  }
  listInMonth(year: number, month: number): Observable<ScheduleAppointmentFilterhResponse> {
    return this.http.get<ScheduleAppointmentFilterhResponse>(`${this.basePath}agendamentos/${year}/${month}`)
  }

  getAppointments(request: GetAppointmentsRequest): Observable<ClientScheduleAppointmentResponse[]> {
    return this.http.get<ClientScheduleAppointmentResponse[]>(
      `${this.basePath}agendamentos/clients/inicio/${request.id}?dataInicio=${request.startAt}&dataFim=${request.endAt}&status=${request.endAt}`
    );
  }

  gettAppointments(request: GetAppointmentsRequest): Observable<ClientScheduleAppointmentResponse[]> {
    let params = new HttpParams()
        .set('id', request.id.toString());

    if (request.startAt) {
        params = params.set('dataInicio', request.startAt);
    }
    if (request.endAt) {
        params = params.set('dataFim', request.endAt);
    }
    if (request.status) {
        params = params.set('status', request.status);
    }

    return this.http.get<ClientScheduleAppointmentResponse[]>(
        `${this.basePath}clients/history/`,
        { params }
    );
}

  listByDate(date: string): Observable<ClientScheduleAppointmentResponse[]> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        return throwError(() => new Error('User ID not found'));
    }

    return this.http.get<ClientScheduleAppointmentResponse[]>(
        `${this.basePath}/clients/history/${userId}?dataInicio=${date}&dataFim=${date}`
    ).pipe(
        catchError(error => {
            if (error.status === 204) {
                return of([]);
            }
            return throwError(() => error);
        })
    );
}

}
