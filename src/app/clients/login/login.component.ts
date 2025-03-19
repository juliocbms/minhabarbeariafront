import { Component, Inject, OnDestroy } from '@angular/core';
import { ClientFormLoginComponent } from "../components/client-form-login/client-form-login.component";
import { SERVICES_TOKEN } from '../../services/service.token';
import { IClienteService } from '../../services/api-client/clients/iclients.service';
import { ClientsService } from '../../services/api-client/clients/clients.service';
import { ClientMOdelFormLogin } from '../client.models';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SnackbarManagerService } from '../../services/snackbar-manager.service';
import { LoginCLientRequest } from '../../services/api-client/clients/client.models';

@Component({
  selector: 'app-login',
  imports: [ClientFormLoginComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

  providers: [
    {
      provide: SERVICES_TOKEN.HTTP.CLIENT, useClass: ClientsService
    },
    { provide: SERVICES_TOKEN.SNACKBAR, useClass: SnackbarManagerService }
  ]
})
export class LoginComponent implements OnDestroy {

  private httpSubscription?: Subscription;

  constructor(
    @Inject(SERVICES_TOKEN.HTTP.CLIENT) private readonly clientService: IClienteService,
    @Inject(SERVICES_TOKEN.SNACKBAR) private readonly snackBarManager: SnackbarManagerService,
    private readonly router: Router
  ) {}

  ngOnDestroy(): void {
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }
  }

  onSubmitClient(value: ClientMOdelFormLogin) {
    this.clientService.login(value).subscribe({
      next: (response) => {
        this.snackBarManager.show('Login realizado com sucesso!');
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['clients/list']);
      },
      error: (error) => {
        this.snackBarManager.show('Erro ao fazer login. Tente novamente.');
      }
    });
  }
}
