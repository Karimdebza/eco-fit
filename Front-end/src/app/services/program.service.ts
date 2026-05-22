import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IProgram } from '../models/IProgram';
import { IExercise } from '../models/IExercise';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  constructor(private http: HttpClient) {}

  getPrograms(): Observable<IProgram[]> {
    return this.http.get<IProgram[]>(`${environment.apiUrl}/programs`);
  }

  getProgramById(id: number): Observable<IProgram> {
    return this.http.get<IProgram>(`${environment.apiUrl}/programs/${id}`);
  }

  addProgram(program: IProgram): Observable<IProgram> {
    return this.http.post<IProgram>(`${environment.apiUrl}/programs`, program);
  }

  updateProgram(program: IProgram): Observable<IProgram> {
    return this.http.put<IProgram>(`${environment.apiUrl}/programs/${program.id_programme}`, program);
  }

  deleteProgram(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/programs/${id}`);
  }

  getFilteredPrograms(params: any): Observable<IProgram[]> {
    return this.http.get<IProgram[]>(`${environment.apiUrl}/programs/filter`, { params });
  }

  addExerciseToProgram(id_programme: number, id_exercise: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/programs/add-exercise`, { id_programme, id_exercise });
  }

  getExercisesForProgram(id_programme: number): Observable<IExercise[]> {
    return this.http.get<IExercise[]>(`${environment.apiUrl}/programs/${id_programme}/exercises`);
  }
}
