import { Injectable } from '@angular/core';
import { ISnackbarManageService } from './isnackbar-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class SnackbarManagerService implements ISnackbarManageService{

  constructor(private readonly snackBar: MatSnackBar) { }


  show(message: string, action: string = 'fechar', duration: number=3000): void {
    this.snackBar.open(message,action,{duration, verticalPosition: 'top', horizontalPosition:'right'})
  }
}
