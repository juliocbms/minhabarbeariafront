import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientMOdelForm } from '../../client.models';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    NgxMaskDirective
  ],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent {

  @Input() client: ClientMOdelForm = {id: 0, name: '', email: '', phone: '', password: ''};

  @Output() clienteSubmited = new EventEmitter<ClientMOdelForm>();

  onSubmit(_: NgForm) {
    this.clienteSubmited.emit(this.client);
  }

}
