import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IExercise } from '../models/IExercise';

import { tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ISingleExerciseResponse } from '../models/ISingleExerciseResponse';
import { IExerciseResponse } from '../models/IExerciseResponse';
// import { catchError } from 'rxjs/operators';

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
      // catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur HTTP:', error);

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('Erreur client:', error.error.message);
    } else {
      // Erreur côté serveur
      console.error(
        `Code d'erreur: ${error.status}, Message: ${error.message}`
      );
      console.error("Corps de l'erreur:", error.error);
    }
  }

  getExerciseById(id: number): Observable<ISingleExerciseResponse> {
    return this.http.get<ISingleExerciseResponse>(
      `${environment.apiUrl}/exercices/${id}`
    );
  }

  addExercise(exercise: IExercise): Observable<IExercise> {
    return this.http.post<IExercise>(
      `${environment.apiUrl}/exercices`,
      exercise
    );
  }

  updateExercise(exercise: IExercise): Observable<IExercise> {
    return this.http.put<IExercise>(
      `${environment.apiUrl}/exercices/${exercise.id}`,
      exercise
    );
  }

  deleteExercise(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/exercices/${id}`);
  }

  searchByName(name: string): Observable<IExercise[]> {
    return this.http.get<IExercise[]>(
      `${environment.apiUrl}/exercices/search/by-name?name=${name}`
    );
  }

  getFilteredExercises(params: any): Observable<IExercise[]> {
    return this.http.get<IExercise[]>(
      `${environment.apiUrl}/exercices/filter`,
      { params }
    );
  }

  countExercises(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/exercices/count`);
  }
}
