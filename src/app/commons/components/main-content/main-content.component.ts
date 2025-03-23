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
import { ScheduleAppointmentFilterhResponse } from '../../../services/api-client/schedules/schedule.models';


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

    const request: ScheduleAppointmentFilterhResponse = {
      id: userIdNumber,
      dataInicio: '',
      dataFim: '',
      status: status,
      scheduledAppointments: []

    };

    this.scheduleService.getAppointments(request).subscribe({
      next: (response: ScheduleAppointmentFilterhResponse[] | null) => {
        console.log('Resposta do backend:', response);
        if (response && response.length > 0 && response[0].scheduledAppointments) {
          this.dataSource.data = response[0].scheduledAppointments;
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
