import { Routes } from '@angular/router';
import { NewClientComponent } from './clients/new-client/new-client.component';
import { SchedulesMonthComponent } from './schedules/schedules-month/schedules-month.component';
import { LoginComponent } from './clients/login/login.component';
import { MainContentComponent } from './commons/components/main-content/main-content.component';
import { AgendamentosTableComponent } from './clients/components/agendamentos-table/agendamentos-table.component';

export const routes: Routes = [
  { path: '', component: LoginComponent, data: { title: 'Login' } },
  {
    path: 'agendamentos',
    children: [
      { path: 'clients/inicio', component: MainContentComponent },
      { path: 'clients/history', component: AgendamentosTableComponent },
      { path: 'save', component: SchedulesMonthComponent }
    ]
  },
  { path: 'clients/new-client', component: NewClientComponent }
];
