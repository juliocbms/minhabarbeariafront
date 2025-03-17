import { Observable } from "rxjs";
import { DetailCLientResponse, ListCLientResponse, LoginCLientRequest, LoginCLientResponse, SaveCLientRequest, SaveCLientResponse, UpdateCLientRequest, UpdateCLientResponse } from "./client.models";

export interface IClienteService{


  save(request: SaveCLientRequest): Observable<SaveCLientResponse>

  login(request: LoginCLientRequest): Observable<LoginCLientResponse>

  update(id: number, request: UpdateCLientRequest): Observable<UpdateCLientResponse>

  delete(id:number): Observable<void>

  list(): Observable <ListCLientResponse[]>

  findByID(id: number): Observable<DetailCLientResponse>
}
