import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { MatCardHeader } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { ClientScheduleAppointmentModel } from '../../../schedules/schedule.models';
import { MatTableDataSource } from '@angular/material/table';
import { SchedulesService } from '../../../services/api-client/schedules/schedules.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ClientScheduleAppointmentResponse, GetAppointmentsRequest, ScheduleAppointmentFilterhResponse } from '../../../services/api-client/schedules/schedule.models';

@Component({
  selector: 'app-main-content',
  imports: [MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatIcon,
    CommonModule, SideBarComponent,
    MatButtonModule, MatTableModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent implements OnInit {
  displayedColumns: string[] = ['id', 'clientName', 'barbeiroName', 'day', 'startAt', 'endAt', 'status'];
  dataSource = new MatTableDataSource<ClientScheduleAppointmentModel>([]);

  selectedStatus: string = '';

  constructor(private scheduleService: SchedulesService) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.warn('Nenhum usuário logado.');
      return;
    }
    console.log('User ID do localStorage:', userId);
    const userIdNumber = Number(userId);
    const status = "PENDENTE";


    const request: GetAppointmentsRequest = {
      id: userIdNumber,
      startAt: '',
      endAt: '' ,
      status: status
    };

    this.scheduleService.getAppointments(request).subscribe({
      next: (response: ClientScheduleAppointmentResponse[] | null) => {
        console.log('Resposta da API:', response);

        if (response && response.length > 0) {
          const mappedData = response.map(appointment => {
            console.log('Agendamento:', appointment);
            return {
              id: appointment.id,
              clientName: appointment.cliente.name,
              clientId: appointment.cliente.id,
              barbeiroName: appointment.barbeiro.name,
              barbeiroId: appointment.barbeiro.id,
              day: new Date(appointment.dataAgendamento),
              startAt: new Date(appointment.startAt * 1000),
              endAt: new Date(appointment.endAt * 1000),
              status: appointment.status
            };
          })

          console.log('Dados mapeados:', mappedData);
          this.dataSource.data = mappedData;
        } else {
          console.log('Nenhum agendamento encontrado.');
          this.dataSource.data = [];
        }
      },
      error: (err) => {
        console.error('Erro ao buscar agendamentos:', err);
        this.dataSource.data = [];
      }
    });
  }

  toggleSidenav(sidenav: any) {
    sidenav.toggle();
  }
}
