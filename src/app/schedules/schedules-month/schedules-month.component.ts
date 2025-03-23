import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ScheduleCalendarComponent } from '../components/schedule-calendar/schedule-calendar.component';
import { SERVICES_TOKEN } from '../../services/service.token';
import { IScheduleService } from '../../services/api-client/schedules/ischedule.service';
import { IClienteService } from '../../services/api-client/clients/iclients.service';
import { ISnackbarManagerService } from '../../services/isnackbar-manager.service';
import { SchedulesService } from '../../services/api-client/schedules/schedules.service';
import { ClientsService } from '../../services/api-client/clients/clients.service';
import { SnackbarManagerService } from '../../services/snackbar-manager.service';
import { Subscription } from 'rxjs';
import { ClientScheduleAppointmentModel, SaveScheduleModel, SelectClientModel } from '../schedule.models';
import { ClientScheduleAppointmentResponse, SaveScheduleRequest, ScheduleAppointmentFilterhResponse } from '../../services/api-client/schedules/schedule.models';

@Component({
  selector: 'app-schedules-month',
  imports: [ScheduleCalendarComponent],
  templateUrl: './schedules-month.component.html',
  styleUrl: './schedules-month.component.scss',
  providers: [
    { provide: SERVICES_TOKEN.HTTP.SCHEDULE, useClass: SchedulesService },
    { provide: SERVICES_TOKEN.HTTP.CLIENT, useClass: ClientsService },
    { provide: SERVICES_TOKEN.SNACKBAR, useClass: SnackbarManagerService }
  ]
})
export class SchedulesMonthComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = []
  private selectedDate?: Date

  monthSchedule!: ScheduleAppointmentFilterhResponse
  clients: SelectClientModel[] = []

  constructor(
    @Inject(SERVICES_TOKEN.HTTP.SCHEDULE) private readonly httpService: IScheduleService,
    @Inject(SERVICES_TOKEN.HTTP.CLIENT) private readonly clientHttpService: IClienteService,
    @Inject(SERVICES_TOKEN.SNACKBAR) private readonly snackbarManage: ISnackbarManagerService
  ) { }

  ngOnInit(): void {
    this.fetchSchedules(new Date());
    this.subscriptions.push(
      this.clientHttpService.list().subscribe(data => {
        this.clients = data
          .filter(client => client.role === 'BARBEIRO')
          .map(client => ({
            id: client.id,
            name: client.name
          }));
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  onDateChange(date: Date) {
    this.selectedDate = date
    this.fetchSchedules(date)
  }

  onConfirmDelete(schedule: ClientScheduleAppointmentResponse) {
    this.subscriptions.push(this.httpService.delete(schedule.id).subscribe())
  }

  onScheduleClient(schedule: SaveScheduleModel) {
    if (schedule.startAt && schedule.endAt && schedule.clientId && schedule.status && schedule.data_agendamento) {
      const request: SaveScheduleRequest = { startAt: schedule.startAt, endAt: schedule.endAt, clientId: schedule.clientId, barbeiroId: schedule.barbeiroId || 0, status: schedule.status, data_agendamento: schedule.data_agendamento }
      this.subscriptions.push(this.httpService.save(request).subscribe(() => {
        this.snackbarManage.show('Agendamento realizado com sucesso')
        if (this.selectedDate) {
          this.fetchSchedules(this.selectedDate)
        }
      }))
    }
  }

  private fetchSchedules(currentDate: Date) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    this.subscriptions.push(this.httpService.listInMonth(year, month).subscribe(data => this.monthSchedule = data));
  }

}
