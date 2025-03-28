import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PerfilFormComponent } from "../perfil-form/perfil-form.component";
import { ClientsService } from '../../../services/api-client/clients/clients.service';
import { SERVICES_TOKEN } from '../../../services/service.token';
import { SnackbarManagerService } from '../../../services/snackbar-manager.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IClienteService } from '../../../services/api-client/clients/iclients.service';
import { ClientMOdelForm } from '../../client.models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from '../../../commons/components/side-bar/side-bar.component';

@Component({
  selector: 'app-put-client',
  imports: [
    PerfilFormComponent,
    MatProgressSpinnerModule,
    CommonModule,
    SideBarComponent
  ],
  templateUrl: './put-client.component.html',
  styleUrl: './put-client.component.scss',
  providers: [
    {
      provide: SERVICES_TOKEN.HTTP.CLIENT, useClass: ClientsService
    },
    { provide: SERVICES_TOKEN.SNACKBAR, useClass: SnackbarManagerService }
  ]
})
export class PutClientComponent implements OnInit, OnDestroy {
  private httpSubscription?: Subscription;
  isLoading = false;
  clientData: ClientMOdelForm = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    password: ''
  };

  constructor(
    @Inject(SERVICES_TOKEN.HTTP.CLIENT) private readonly httpService: IClienteService,
    @Inject(SERVICES_TOKEN.SNACKBAR) private readonly snackBarManager: SnackbarManagerService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.loadClientData();
  }

  private getUserIdFromToken(): number | null {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.snackBarManager.show('Usuário não autenticado!');
      this.router.navigate(['/login']);
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || null;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      this.snackBarManager.show('Erro na autenticação!');
      this.router.navigate(['/login']);
      return null;
    }
  }

  loadClientData() {
    const userId = this.getUserIdFromToken();
    if (!userId) return;

    this.isLoading = true;
    this.httpService.findByID(userId).subscribe({
      next: (client) => {
        this.clientData = {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          password: ''
        };
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.snackBarManager.show('Erro ao carregar dados do usuário!');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmitClient(value: ClientMOdelForm) {
    const userId = this.getUserIdFromToken();
    if (!userId || value.id !== userId) {
      this.snackBarManager.show('Não autorizado!');
      return;
    }

    this.isLoading = true;

    // Extrai os dados do formulário (exceto id)
    const { id, ...requestData } = value;

    // Adiciona a role
    const request = {
      id: userId, // Garante que o ID está incluído
      name: value.name,
      email: value.email,
      phone: value.phone,
      password: value.password,
      role: 'CLIENTE'
    };
    console.log('Updating client:', { userId, request });
    this.httpSubscription = this.httpService.update(userId, request).subscribe({
      next: () => {
        this.snackBarManager.show('Dados atualizados com sucesso!');
      },
      error: (error) => {
        console.error('Erro na atualização:', error);
        this.snackBarManager.show('Erro ao atualizar dados!');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.httpSubscription?.unsubscribe();
  }
}
