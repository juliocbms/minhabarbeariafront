import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { ClientMOdelForm } from '../../client.models';
import { UpdateCLientResponse } from '../../../services/api-client/clients/client.models';



@Component({
  selector: 'app-perfil-form',
  imports: [CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    NgxMaskDirective,
    ],
  templateUrl: './perfil-form.component.html',
  styleUrl: './perfil-form.component.scss'
})
export class PerfilFormComponent {
  @Input() disabled: boolean = false;
  @Input() client: ClientMOdelForm = {id: 0, name: '', email: '', phone: '', password: ''};

  @Output() clienteUpdateded = new EventEmitter<UpdateCLientResponse>();

  onSubmit(_: NgForm) {
    this.clienteUpdateded.emit(this.client);
  }
}
