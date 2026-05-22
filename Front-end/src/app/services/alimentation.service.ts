import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IAliment } from '../models/IAlimentation';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { IAlimentResponse } from '../models/IAlimentResponse';

@Injectable({
  providedIn: 'root',
})
export class AlimentationService {
  constructor(private http: HttpClient) {}

 getAliments(limit = 20, offset = 0): Observable<IAlimentResponse> {
    const url = `${environment.apiUrl}/alimentation/?limit=${limit}&offset=${offset}`;
    console.log('Appel API vers:', url);
    
    return this.http.get<IAlimentResponse>(url).pipe(
      tap(response => {
        console.log('Réponse brute du service:', response);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur HTTP:', error);
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('Erreur client:', error.error.message);
    } else {
      // Erreur côté serveur
      console.error(`Code d'erreur: ${error.status}, Message: ${error.message}`);
      console.error('Corps de l\'erreur:', error.error);
    }
    
    return throwError(() => error);
  }
  getAlimentById(id: number): Observable<IAliment> {
    return this.http.get<IAliment>(`${environment.apiUrl}/alimentation/${id}`);
  }

  addAliment(aliment: IAliment): Observable<IAliment> {
    return this.http.post<IAliment>(`${environment.apiUrl}/aliments`, aliment);
  }

  updateAliment(aliment: IAliment): Observable<IAliment> {
    return this.http.put<IAliment>(`${environment.apiUrl}/aliments/${aliment.id}`, aliment);
  }

  deleteAliment(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/aliments/${id}`);
  }

searchByName(name: string): Observable<IAlimentResponse> {
  return this.http.get<IAlimentResponse>(
    `${environment.apiUrl}/alimentation/?search=${encodeURIComponent(name)}&limit=10`
  );
}

  getFilteredAliments(params: any): Observable<IAliment[]> {
    return this.http.get<IAliment[]>(`${environment.apiUrl}/aliments/filter`, { params });
  }

  countAliments(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/aliments/count`);
  }
}
