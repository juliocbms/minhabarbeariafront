import { Component, Inject } from '@angular/core';
import { IClienteService } from '../../services/api-client/clients/iclients.service';
import { SERVICES_TOKEN } from '../../services/service.token';
import { ClientsService } from '../../services/api-client/clients/clients.service';

@Component({
  selector: 'app-list-clients',
  imports: [],
  templateUrl: './list-clients.component.html',
  styleUrl: './list-clients.component.scss',
    providers: [
      {
       provide: SERVICES_TOKEN.HTTP.CLIENT, useClass: ClientsService
      }
    ]
})
export class ListClientsComponent {

  constructor(@Inject (SERVICES_TOKEN.HTTP.CLIENT) private readonly httpService: IClienteService){

  }

}
