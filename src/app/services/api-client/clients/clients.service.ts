import { Injectable } from '@angular/core';
import { IClienteService } from './iclients.service';
import { Observable } from 'rxjs';
import { SaveCLientRequest, SaveCLientResponse, UpdateCLientRequest, UpdateCLientResponse, ListCLientResponse, DetailCLientResponse, LoginCLientRequest, LoginCLientResponse } from './client.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientsService implements IClienteService{

  private readonly basePath = environment.apiUrl

  constructor(private http: HttpClient) { }


  login(request: LoginCLientRequest): Observable<LoginCLientResponse> {
    return this.http.post<LoginCLientResponse>(`${this.basePath}clients/login`, request);
  }


  save(request: SaveCLientRequest): Observable<SaveCLientResponse> {
    return this.http.post<SaveCLientResponse>(`${this.basePath}clients`, request)
  }
  update(id: number, request: UpdateCLientRequest): Observable<UpdateCLientResponse> {
    return this.http.put<UpdateCLientResponse>(`${this.basePath}clients/${id}`, request)
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}clients${id}`)
  }
  list(): Observable<ListCLientResponse[]> {
    return this.http.get<ListCLientResponse[]>(`${this.basePath}clients`)
  }
  findByID(id: number): Observable<DetailCLientResponse> {
    return this.http.get<SaveCLientResponse>(`${this.basePath}clients${id}`)
  }
}
