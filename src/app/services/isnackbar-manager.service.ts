export interface ISnackbarManageService{
  show(message: string, action?: string, duration?:number): void
}
