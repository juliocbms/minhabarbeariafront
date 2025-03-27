import { Component, Inject, OnDestroy } from '@angular/core';
import { SERVICES_TOKEN } from '../../services/service.token';
import { IClienteService } from '../../services/api-client/clients/iclients.service';
import { ClientsService } from '../../services/api-client/clients/clients.service';
import { ClientFormComponent } from "../components/client-form/client-form.component";
import { ClientMOdelForm } from '../client.models';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SnackbarManagerService } from '../../services/snackbar-manager.service';

@Component({
  selector: 'app-new-client',
  imports: [ClientFormComponent],
  templateUrl: './new-client.component.html',
  styleUrl: './new-client.component.scss',
  providers: [
    {
     provide: SERVICES_TOKEN.HTTP.CLIENT, useClass: ClientsService
    },
    {provide: SERVICES_TOKEN.SNACKBAR, useClass: SnackbarManagerService}
  ]
})
export class NewClientComponent implements OnDestroy{

  private httpSubscription?: Subscription

  private routeSubscription?: Subscription

  constructor(
  @Inject (SERVICES_TOKEN.HTTP.CLIENT) private readonly httpService: IClienteService,
  @Inject(SERVICES_TOKEN.SNACKBAR) private readonly snackBarManager: SnackbarManagerService,
  private readonly router: Router

  ){

  }
  ngOnDestroy(): void {
    if (this.httpSubscription){
      this.httpSubscription.unsubscribe()
    }
  }

  onSubmitClient(value: ClientMOdelForm) {
    const { id, ...request } = value;


    const clientData = {
      ...request,
      role: 'CLIENTE'

    };


    this.httpService.save(clientData).subscribe({
      next: (_) => {
        this.snackBarManager.show('Usuário cadastrado com sucesso!');
        console.log('Redirecionando para login...');
        this.router.navigate(['clients/login']);
      },
      error: (error) => {
        console.error('Erro ao cadastrar usuário', error);
        this.snackBarManager.show('Erro ao cadastrar usuário!');
      },
      complete: () => {
        console.log('Processo de cadastro concluído.');
      }
    });
    this.router.navigate(['']);
  }

}
