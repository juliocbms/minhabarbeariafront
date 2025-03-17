import { InjectionToken } from "@angular/core";
import { IClienteService } from "./api-client/clients/iclients.service";
import { ISnackbarManageService } from "./isnackbar-manager.service";

export const SERVICES_TOKEN = {
  HTTP:{
    CLIENT: new InjectionToken<IClienteService>('SERVICES.HTTP.CLIENT'),
    //SCHEDULE: new InjectionToken<IScheduleService>('SERVICES.HTTP.CLIENT.SCHEDULE'),

  },
  SNACKBAR: new InjectionToken<ISnackbarManageService>('SERVICE_TOKEN.SNACKBAR')
}
