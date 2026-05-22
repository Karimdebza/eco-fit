import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IRole } from '../models/IRole';
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http:HttpClient) { }

  getRoles(): Observable<IRole[]> {
    return this.http.get<IRole[]>(`${environment.apiUrl}/roles`);
  }
  getRoleById(id: number): Observable<IRole> {
    return this.http.get<IRole>(`${environment.apiUrl}/roles/${id}`);
  }
  addRole(role: IRole): Observable<IRole> {
    return this.http.post<IRole>(`${environment.apiUrl}/roles`, role);
  }
  updateRole(role: IRole): Observable<IRole> {
    return this.http.put<IRole>(`${environment.apiUrl}/roles/${role.id_role}`, role);
  }
  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/roles/${id}`);
  }
  
}
