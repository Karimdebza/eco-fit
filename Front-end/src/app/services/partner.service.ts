import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IPartner } from '../models/IPartner';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  constructor(private http: HttpClient) {}

  getPartners(): Observable<IPartner[]> {
    return this.http.get<IPartner[]>(`${environment.apiUrl}/partners`);
  }

  getPartnerById(id: number): Observable<IPartner> {
    return this.http.get<IPartner>(`${environment.apiUrl}/partners/${id}`);
  }

  addPartner(partner: IPartner): Observable<IPartner> {
    return this.http.post<IPartner>(`${environment.apiUrl}/partners`, partner);
  }

  updatePartner(partner: IPartner): Observable<IPartner> {
    return this.http.put<IPartner>(`${environment.apiUrl}/partners/${partner.id_partner}`, partner);
  }

  deletePartner(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/partners/${id}`);
  }
}
