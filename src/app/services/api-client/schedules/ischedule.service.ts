import { Observable } from "rxjs";
import { SaveScheduleRequest, SaveScheduleResponse, ScheduleAppointmentFilterhResponse } from "./schedule.models";

export interface IScheduleService {

    save(request: SaveScheduleRequest): Observable<SaveScheduleResponse>

    delete(id: number): Observable<void>

    listInMonth(year: number, month: number): Observable<ScheduleAppointmentFilterhResponse>



}
