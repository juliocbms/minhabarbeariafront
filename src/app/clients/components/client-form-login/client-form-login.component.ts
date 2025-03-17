import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientMOdelForm, ClientMOdelFormLogin } from '../../client.models';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-form-login',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './client-form-login.component.html',
  styleUrl: './client-form-login.component.scss'
})
export class ClientFormLoginComponent {

  @Input() client: ClientMOdelFormLogin = { email: '', password: ''};

  @Output() clienteSubmited = new EventEmitter<ClientMOdelFormLogin>();

  onSubmit(_: NgForm) {
    this.clienteSubmited.emit(this.client);
  }

}

