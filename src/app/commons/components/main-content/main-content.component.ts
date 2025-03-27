import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { MatCardHeader } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { ClientScheduleAppointmentModel } from '../../../schedules/schedule.models';
import { MatTableDataSource } from '@angular/material/table';
import { SchedulesService } from '../../../services/api-client/schedules/schedules.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ClientScheduleAppointmentResponse, GetAppointmentsRequest} from '../../../services/api-client/schedules/schedule.models';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-main-content',
  imports: [MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatIcon,
    MatPaginatorModule,
    CommonModule, SideBarComponent,
    MatButtonModule, MatTableModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
  providers: [DatePipe]
})
export class MainContentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['id', 'clientName', 'barbeiroName', 'day', 'startAt', 'endAt', 'status'];
  dataSource = new MatTableDataSource<ClientScheduleAppointmentModel>([]);

  selectedStatus: string = '';

  constructor(private scheduleService: SchedulesService,
    private readonly router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 6;
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
        if (response && response.length > 0) {
          const mappedData = response.map(appointment => {

            const dataAgendamento = this.convertToLocalDate(appointment.dataAgendamento);
            const startAt = this.convertToLocalDateTime(appointment.startAt);
            const endAt = this.convertToLocalDateTime(appointment.endAt);

            return {
              id: appointment.id,
              clientName: appointment.cliente.name,
              clienteId: appointment.cliente.id,
              barbeiroName: appointment.barbeiro.name,
              barbeiroId: appointment.barbeiro.id,
              day: dataAgendamento,
              startAt: startAt,
              endAt: endAt,
              status: "PENDENTE",

              formattedDay: this.datePipe.transform(dataAgendamento, 'dd/MM/yyyy'),
              formattedStartAt: this.datePipe.transform(startAt, 'HH:mm'),
              formattedEndAt: this.datePipe.transform(endAt, 'HH:mm')
            };
          });

          console.log('Dados mapeados:', mappedData);
          this.dataSource.data = mappedData;
        } else {
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

  navigateToNewSchedule(): void {
    this.router.navigate(['agendamentos/save'])
  }

  private convertToLocalDateTime(timestamp: number | string): Date {

    if (typeof timestamp === 'number') {
      return new Date(timestamp * 1000);
    }

    return new Date(timestamp);

}
private convertToLocalDate(dateString: string | Date): Date {
  if (typeof dateString === 'string') {

    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(dateString);
}
}
