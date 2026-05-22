import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IUser } from '../models/IUser';
import { IUserSignup } from '../models/IFormUser';
import { IUserResponse } from '../models/IUserResponse';

interface ApiResponse<T> {
  status: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<ApiResponse<IUser>> {
  return this.http.get<ApiResponse<IUser>>(`${environment.apiUrl}/users/me`, { withCredentials: true });
}
  getUserById(id: number): Observable<IUserResponse> {
  return this.http.get<IUserResponse>(`${environment.apiUrl}/users/${id}`, {
    withCredentials: true
  });
}
  addUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${environment.apiUrl}/users`, user);
  }
  updateUser(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${environment.apiUrl}/users/${user.id_user}`, user, {
    withCredentials: true
  });
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/${id}`,  {
    withCredentials: true
  });
  }
  getUserByEmail(email: string): Observable<IUser> {
    return this.http.get<IUser>(`${environment.apiUrl}/users/email/${email}`);
  }
  signup(user: IUserSignup): Observable<IUserSignup> {
    return this.http.post<IUserSignup>(`${environment.apiUrl}/users/register`, user);
  }
logout(): Observable<any> {
  return this.http.post<any>(
    `${environment.apiUrl}/users/logout`, 
    {}, // Body vide désormais acceptable
    { withCredentials: true }
  );
}

  updatePassword(id: number, password: string): Observable<IUser> {
    return this.http.put<IUser>(`${environment.apiUrl}/users/${id}/password`, { password });
  }
  updateProfilePicture(id: number, picture: File): Observable<IUser> {
    const formData = new FormData();
    formData.append('picture', picture);
    return this.http.put<IUser>(`${environment.apiUrl}/users/${id}/profile-picture`, formData);
  }
  
  disableUser(id: number): Observable<IUser> {
    return this.http.put<IUser>(`${environment.apiUrl}/users/disable/${id}`, {});
  }

  checkToken(): Observable<IUser | null> {
  return this.http.get<IUser>(`${environment.apiUrl}/users/check-token`, {
    withCredentials: true
  }).pipe(
    tap(user => console.log('User from checkToken:', user)),
    catchError(error => {
      console.error('Token check failed:', error);
      // En cas d’erreur, on retourne un Observable avec null pour gérer l’absence d’utilisateur
      return of(null);
    })
  );
}

login(data:IUser): Observable<IUserResponse> {
  return this.http.post<IUserResponse>(`${environment.apiUrl}/users/login`, data, {
    withCredentials: true
  });
}



}
