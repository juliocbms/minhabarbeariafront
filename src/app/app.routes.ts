import { Routes } from '@angular/router';
import { EditClientComponent } from './clients/edit-client/edit-client.component';
import { NewClientComponent } from './clients/new-client/new-client.component';
import { ListClientsComponent } from './clients/list-clients/list-clients.component';
import { SchedulesMonthComponent } from './schedules/schedules-month/schedules-month.component';
import { LoginComponent } from './clients/login/login.component';
import { MainContentComponent } from './commons/components/main-content/main-content.component';

export const routes: Routes = [
  {
    path: 'clients/edit-client/:id', component: EditClientComponent, data: {title: 'Atualizar Cliente'}},
    {path: '', component:LoginComponent, data: {title: 'Login'}},
    {path: 'agendamentos/clients/inicio', component:MainContentComponent, data: {title: 'inicio'}},
    {path: 'clients/new-client', component:NewClientComponent , data: {title: 'Cadastro'}},
    {path: 'clients/list', component: ListClientsComponent, data: {title: 'Clientes Cadastrados'}},
    {path: 'agendamentos/save', component:SchedulesMonthComponent , data: {title: 'Agendamentos'}}

];
