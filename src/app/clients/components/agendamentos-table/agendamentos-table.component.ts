import { Component, OnInit, ViewChild } from '@angular/core';
import { SideBarComponent } from "../../../commons/components/side-bar/side-bar.component";
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardTitle, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {  FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { YesNoDialogComponent } from '../../../commons/components/yes-no-dialog/yes-no-dialog.component';
import { ClientScheduleAppointmentResponse, GetAppointmentsRequest } from '../../../services/api-client/schedules/schedule.models';
import { SchedulesService } from '../../../services/api-client/schedules/schedules.service';
import { MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-agendamentos-table',
  templateUrl: './agendamentos-table.component.html',
  styleUrls: ['./agendamentos-table.component.scss'],
  providers: [DatePipe],
  imports: [SideBarComponent,
    MatNativeDateModule,
    MatCard,
    MatFormFieldModule,
    MatInputModule,
    MatFormField,
    MatLabel,
    MatDatepickerModule,
    MatSelect,
    MatOption,
    MatCardTitle,
    MatCardHeader,
    ReactiveFormsModule,
    RouterModule,
    MatCardContent,
    MatIcon,
    MatPaginatorModule,
    CommonModule, SideBarComponent,
    MatButtonModule, MatTableModule
  ]
})
export class AgendamentosTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'clientName', 'barbeiroName', 'day', 'startAt', 'endAt', 'status', 'actions'];
  dataSource = new MatTableDataSource<ClientScheduleAppointmentResponse>([]);

  filterForm = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    status: new FormControl('')
  });

  statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'CONFIRMADO', label: 'Confirmado' },
    { value: 'CANCELADO', label: 'Cancelado' },
    { value: 'FINALIZADO', label: 'Finalizado' }
  ];

  constructor(
    private scheduleService: SchedulesService,
    private router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAppointments(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.warn('Nenhum usuário logado.');
      return;
    }

    const formValue = this.filterForm.value;
    const request: GetAppointmentsRequest = {
      id: Number(userId),
      startAt: formValue.startDate ? this.formatDate(formValue.startDate) : '',
      endAt: formValue.endDate ? this.formatDate(formValue.endDate) : '',
      status: formValue.status || ''
    };

    this.scheduleService.gettAppointments(request).subscribe({
      next: (response) => {
        if (response) {

          this.dataSource.data = response.map(appointment => ({
            ...appointment,
            day: appointment.dataAgendamento,
            startAt: appointment.startAt,
            endAt: appointment.endAt
          }));
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

  applyFilters(): void {
    this.loadAppointments();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.loadAppointments();
  }

  deleteAppointment(id: number): void {
    const dialogRef = this.dialog.open(YesNoDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar Exclusão',
        message: 'Tem certeza que deseja excluir este agendamento?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scheduleService.delete(id).subscribe({
          next: () => {
            this.loadAppointments();
          },
          error: (err) => console.error('Erro ao excluir agendamento:', err)
        });
      }
    });
  }

  navigateToNewSchedule(): void {
    this.router.navigate(['agendamentos/save']);
  }

  private formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
}
