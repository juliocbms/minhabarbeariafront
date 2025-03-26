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
import {  SaveScheduleModel, SelectClientModel } from '../schedule.models';
import { SideBarComponent } from '../../commons/components/side-bar/side-bar.component';
import { ClientScheduleAppointmentResponse, SaveScheduleRequest, ScheduleAppointmentFilterhResponse } from '../../services/api-client/schedules/schedule.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedules-month',
  imports: [ScheduleCalendarComponent,
    SideBarComponent
  ],
  templateUrl: './schedules-month.component.html',
  styleUrl: './schedules-month.component.scss',
  providers: [
    { provide: SERVICES_TOKEN.HTTP.SCHEDULE, useClass: SchedulesService },
    { provide: SERVICES_TOKEN.HTTP.CLIENT, useClass: ClientsService },
    { provide: SERVICES_TOKEN.SNACKBAR, useClass: SnackbarManagerService }
  ]
})
export class SchedulesMonthComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private selectedDate: Date = new Date();

  appointments: ClientScheduleAppointmentResponse[] = [];
  barbeiros: SelectClientModel[] = [];

  constructor(
    @Inject(SERVICES_TOKEN.HTTP.SCHEDULE) private readonly httpService: IScheduleService,
    @Inject(SERVICES_TOKEN.HTTP.CLIENT) private readonly clientHttpService: IClienteService,
    @Inject(SERVICES_TOKEN.SNACKBAR) private readonly snackbarManage: ISnackbarManagerService
  ) { }

  ngOnInit(): void {
    this.loadBarbers();
    this.fetchSchedules(this.selectedDate);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private loadBarbers(): void {
    this.subscriptions.push(
      this.clientHttpService.list().subscribe(data => {
        this.barbeiros = data
          .filter(client => client.role === 'BARBEIRO')
          .map(client => ({
            id: client.id,
            name: client.name,
            role: client.role
          }));
      })
    );
  }

  onDateChange(date: Date) {
    this.selectedDate = date;
    this.fetchSchedules(date);
  }

  onConfirmDelete(schedule: ClientScheduleAppointmentResponse) {
    this.subscriptions.push(
      this.httpService.delete(schedule.id).subscribe(() => {
        this.fetchSchedules(this.selectedDate);
      })
    );
  }

  onScheduleClient(schedule: SaveScheduleModel) {
    if (schedule.startAt && schedule.endAt && schedule.clienteId && schedule.status && schedule.dataAgendamento) {
      const request: SaveScheduleRequest = {
        startAt: schedule.startAt,
        endAt: schedule.endAt,
        clienteId: schedule.clienteId,
        barbeiroId: schedule.barbeiroId || 0,
        status: schedule.status,
        dataAgendamento: schedule.dataAgendamento
      };

      this.subscriptions.push(
        this.httpService.save(request).subscribe(() => {
          this.snackbarManage.show('Agendamento realizado com sucesso');
          this.fetchSchedules(this.selectedDate);
        })
      );
    }
  }

  private fetchSchedules(date: Date) {
    const formattedDate = new DatePipe('en-US').transform(date, 'yyyy-MM-dd');

    if (!formattedDate) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('User ID not found');
        return;
    }

    this.subscriptions.push(
        this.httpService.listByDate(formattedDate).subscribe({
            next: (data) => {
                this.appointments = data;
            },
            error: (err) => {
                console.error('Erro ao buscar agendamentos:', err);
                this.appointments = [];
            }
        })
    );
}
}
