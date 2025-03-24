import { AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SERVICES_TOKEN } from '../../../services/service.token';
import { DialogManagerService } from '../../../services/dialog-manager.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClientScheduleAppointmentModel, SaveScheduleModel, SelectClientModel } from '../../schedule.models';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { IDialogManagerService } from '../../../services/idialog-manager.service';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { YesNoDialogComponent } from '../../../commons/components/yes-no-dialog/yes-no-dialog.component';
import { Subscription } from 'rxjs';
import { ClientScheduleAppointmentResponse, ScheduleAppointmentFilterhResponse } from '../../../services/api-client/schedules/schedule.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule-calendar',
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatTimepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './schedule-calendar.component.html',
  styleUrl: './schedule-calendar.component.scss',
  providers: [
    provideNativeDateAdapter(),
    {
      provide: SERVICES_TOKEN.DIALOG, useClass: DialogManagerService
    }
  ]
})
export class ScheduleCalendarComponent implements OnDestroy, AfterViewInit, OnChanges, OnInit {

  private subscription?: Subscription

  private _selected: Date = new Date();

  displayedColumns: string[] = ['id', 'clientName', 'barbeiroName', 'startAt', 'endAt', 'status', 'actions'];

  dataSource!: MatTableDataSource<ClientScheduleAppointmentResponse>

  addingSchedule: boolean = false

  newSchedule: SaveScheduleModel = { startAt: undefined, endAt: undefined, clienteId: undefined, barbeiroId: undefined, status: undefined, dataAgendamento: undefined }

  clientSelectFormControl = new FormControl()

  @Input() monthSchedule!: ScheduleAppointmentFilterhResponse
  @Input() barbers: SelectClientModel[] = []

  @Input() set clients(clients: SelectClientModel[]) {
    this._barbers = clients;
    this.barbers = clients.filter(client => client.role === 'BARBEIRO');
  }

  get clients(): SelectClientModel[] {
    return this._barbers;
  }

  private _barbers: SelectClientModel[] = [];

  @Output() onDateChange = new EventEmitter<Date>()
  @Output() onConfirmDelete = new EventEmitter<ClientScheduleAppointmentResponse>()
  @Output() onScheduleClient = new EventEmitter<SaveScheduleModel>()

  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(@Inject(SERVICES_TOKEN.DIALOG) private readonly dialogManagerService: IDialogManagerService,
  private readonly router: Router) { }


  ngOnInit() {
    const userId = localStorage.getItem('userId');

  if (!userId) {
    console.warn('Nenhum usuário logado.');
    return;
  }

  console.log('User ID do localStorage:', userId);
  this.newSchedule.clienteId = Number(userId);
  }

  get selected(): Date {
    return this._selected
  }

  set selected(selected: Date) {
    if (this._selected.getTime() !== selected.getTime()) {
      this.onDateChange.emit(selected)
      this.buildTable()
      this._selected = selected
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  ngAfterViewInit(): void {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['monthSchedule'] && this.monthSchedule) {
      this.buildTable()
    }
  }

  onSubmit(form: NgForm) {
    console.log('onSubmit chamado!', this.newSchedule);
    if (this.newSchedule.startAt && this.newSchedule.endAt && this.newSchedule.clienteId && this.newSchedule.barbeiroId) {
      this.newSchedule.status = "PENDENTE";
      const startAtDate = new Date(this.newSchedule.startAt);
      startAtDate.setHours(startAtDate.getHours() - 3);

      const endAtDate = new Date(this.newSchedule.endAt);
      endAtDate.setHours(endAtDate.getHours() - 3);


      const startAtIso = startAtDate.toISOString();
      const endAtIso = endAtDate.toISOString();


      this.newSchedule.dataAgendamento = startAtIso.split('T')[0];

      const saved: SaveScheduleModel = {
        startAt: startAtIso,
        endAt: endAtIso,
        clienteId: this.newSchedule.clienteId,
        barbeiroId: this.newSchedule.barbeiroId,
        status: 'PENDENTE',
        dataAgendamento: this.newSchedule.dataAgendamento
      };
      console.log('Dados enviados para o componente pai:', saved);
      this.onScheduleClient.emit(saved);
      this.router.navigate(['agendamentos/clients/inicio']);

      form.resetForm();
      this.newSchedule = { startAt: undefined, endAt: undefined, clienteId: this.newSchedule.clienteId, barbeiroId: undefined, status: 'PENDENTE', dataAgendamento: undefined };
    }
  }


  requestDelete(schedule: ClientScheduleAppointmentResponse) {
    this.subscription = this.dialogManagerService.showYesNoDialog(
      YesNoDialogComponent,
      { title: 'Exclusão de agendamento', content: 'Confirma a exclusão do agendamento?' }
    ).subscribe(result => {
      if (result) {
        this.onConfirmDelete.emit(schedule)
        const updatedList = this.dataSource.data.filter(c => c.id !== schedule.id)
        this.dataSource = new MatTableDataSource<ClientScheduleAppointmentResponse>(updatedList)
        if (this.paginator) {
          this.dataSource.paginator = this.paginator
        }
      }
    })
  }

  onTimeChange(time: Date) {
    const endAt = new Date(time);
    endAt.setHours(time.getHours() + 1);
    this.newSchedule.endAt = endAt.toISOString();
  }


  private buildTable() {
    const selectedYear = this._selected.getFullYear();
    const selectedMonth = this._selected.getMonth() + 1;
    const selectedDay = this._selected.getDate();

    const appointments = this.monthSchedule.scheduledAppointments.filter(a => {
      const appointmentDate = new Date(a.dataAgendamento);
      return (
        appointmentDate.getFullYear() === selectedYear &&
        appointmentDate.getMonth() + 1 === selectedMonth &&
        appointmentDate.getDate() === selectedDay
      );
    });

    this.dataSource = new MatTableDataSource<ClientScheduleAppointmentResponse>(appointments);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator
    }
  }
}
