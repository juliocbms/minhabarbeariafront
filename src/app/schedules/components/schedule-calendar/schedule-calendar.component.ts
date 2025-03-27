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
export class ScheduleCalendarComponent implements OnDestroy, AfterViewInit, OnInit {

  private subscription?: Subscription
  private _selected: Date = new Date();

  displayedColumns: string[] = ['id', 'clientName', 'barbeiroName', 'startAt', 'endAt', 'status', 'actions'];
  dataSource = new MatTableDataSource<ClientScheduleAppointmentResponse>([]);
  addingSchedule: boolean = false

  newSchedule: SaveScheduleModel = {
    startAt: undefined,
    endAt: undefined,
    clienteId: undefined,
    barbeiroId: undefined,
    status: undefined,
    dataAgendamento: undefined
  }

  clientSelectFormControl = new FormControl()

  @Input() appointments: ClientScheduleAppointmentResponse[] = [];
  @Input() barbers: SelectClientModel[] = []

  @Output() onDateChange = new EventEmitter<Date>()
  @Output() onConfirmDelete = new EventEmitter<ClientScheduleAppointmentResponse>()
  @Output() onScheduleClient = new EventEmitter<SaveScheduleModel>()

  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(
    @Inject(SERVICES_TOKEN.DIALOG) private readonly dialogManagerService: IDialogManagerService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.warn('Nenhum usuário logado.');
      return;
    }
    this.newSchedule.clienteId = Number(userId);
  }

  get selected(): Date {
    return this._selected;
  }

  set selected(selected: Date) {
    if (this._selected.getTime() !== selected.getTime()) {
      this._selected = selected;
      this.onDateChange.emit(selected);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onSubmit(form: NgForm) {
    if (this.newSchedule.startAt && this.newSchedule.endAt && this.newSchedule.clienteId && this.newSchedule.barbeiroId) {

      const selectedDate = new Date(this._selected);

      const startAtDate = this.combineDateAndTime(selectedDate, new Date(this.newSchedule.startAt));
      const endAtDate = this.combineDateAndTime(selectedDate, new Date(this.newSchedule.endAt));

      const startAtWithOffset = this.formatToOffsetDateTime(startAtDate);
      const endAtWithOffset = this.formatToOffsetDateTime(endAtDate);
      const formattedDate = this.formatToBrazilianDate(selectedDate);

      const saved: SaveScheduleModel = {
        startAt: startAtWithOffset,
        endAt: endAtWithOffset,
        clienteId: this.newSchedule.clienteId,
        barbeiroId: this.newSchedule.barbeiroId,
        status: 'PENDENTE',
        dataAgendamento: formattedDate
      };

      console.log('Dados enviados para API:', saved);
      this.onScheduleClient.emit(saved);

      form.resetForm();
      this.resetNewSchedule();
    }
    this.router.navigate(['agendamentos/clients/inicio']);
  }

  private combineDateAndTime(date: Date, time: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      0
    );
  }

  private formatToOffsetDateTime(date: Date): string {
    const offset = '-03:00';

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}` +
           `T${pad(date.getHours())}:${pad(date.getMinutes())}:00${offset}`;
  }

  private formatToBrazilianDate(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
  }

  private resetNewSchedule() {
    this.newSchedule = {
      startAt: undefined,
      endAt: undefined,
      clienteId: this.newSchedule.clienteId,
      barbeiroId: undefined,
      status: 'PENDENTE',
      dataAgendamento: undefined
    };
  }

  requestDelete(schedule: ClientScheduleAppointmentResponse) {
    this.subscription = this.dialogManagerService.showYesNoDialog(
      YesNoDialogComponent,
      { title: 'Exclusão de agendamento', content: 'Confirma a exclusão do agendamento?' }
    ).subscribe(result => {
      if (result) {
        this.onConfirmDelete.emit(schedule);
        const updatedList = this.dataSource.data.filter(c => c.id !== schedule.id);
        this.dataSource.data = updatedList;
      }
    });
  }

  onTimeChange(time: Date) {
    const endAt = new Date(time);
    endAt.setHours(time.getHours() + 1);
    this.newSchedule.endAt = endAt.toISOString();
  }
}
