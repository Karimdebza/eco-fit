import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { IExercise } from '../models/IExercise';
import { ISingleExerciseResponse } from '../models/ISingleExerciseResponse';
import { IExerciseResponse } from '../models/IExerciseResponse';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  constructor(private http: HttpClient) {}

  getExercises(limit = 20, offset = 0): Observable<IExerciseResponse> {
    const url = `${environment.apiUrl}/exercices/?limit=${limit}&offset=${offset}`;
    console.log('Appel API vers:', url);

    return this.http.get<IExerciseResponse>(url).pipe(
      tap((response) => {
        console.log('Réponse brute du service:', response);
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur HTTP:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Erreur client:', error.error.message);
    } else {
      console.error(`Code d'erreur: ${error.status}, Message: ${error.message}`);
      console.error("Corps de l'erreur:", error.error);
    }
  }

  // L'ID passe en string
  getExerciseById(id: string): Observable<ISingleExerciseResponse> {
    return this.http.get<ISingleExerciseResponse>(
      `${environment.apiUrl}/exercices/${id}`
    );
  }

  addExercise(exercise: IExercise): Observable<IExercise> {
    return this.http.post<IExercise>(`${environment.apiUrl}/exercices`, exercise);
  }

  updateExercise(exercise: IExercise): Observable<IExercise> {
    return this.http.put<IExercise>(
      `${environment.apiUrl}/exercices/${exercise.id}`,
      exercise
    );
  }

  // L'ID passe en string
  deleteExercise(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/exercices/${id}`);
  }

  searchByName(name: string): Observable<IExercise[]> {
    return this.http.get<IExercise[]>(
      `${environment.apiUrl}/exercices/search/by-name?name=${name}`
    );
  }

  getFilteredExercises(params: any): Observable<IExercise[]> {
    return this.http.get<IExercise[]>(`${environment.apiUrl}/exercices/filter`, { params });
  }

  countExercises(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/exercices/count`);
  }
}