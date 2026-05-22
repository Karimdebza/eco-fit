import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IEvent } from '../models/IEvent';
import { IUser } from '../models/IUser';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<IEvent[]> {
    return this.http.get<{ status: string, data: IEvent[] }>(this.baseUrl)
      .pipe(map(response => response.data));
  }

  getEventById(id: number): Observable<IEvent> {
    return this.http.get<{ status: string, data: IEvent }>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  addEvent(event: Partial<IEvent>): Observable<IEvent> {
    const { id_event, ...eventData } = event;
    return this.http.post<IEvent>(this.baseUrl, eventData);
  }

  updateEvent(event: IEvent): Observable<IEvent> {
    return this.http.put<IEvent>(`${this.baseUrl}/${event.id_event}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getEventsByTheme(theme: string): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/theme/${theme}`);
  }

  getEventsByDate(date: string): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/date/${date}`);
  }

  getEventsByLocation(location: string): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/location/${location}`);
  }

  getEventsByRating(rating: number): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/rating/${rating}`);
  }

  joinEvent(id: number): Observable<IUser> {
  return this.http.post<IUser>(`${environment.apiUrl}/events/${id}/join`, {}, { withCredentials: true });
  }

  leaveEvent(id: number): Observable<IUser> {
    return this.http.post<IUser>(`${environment.apiUrl}/events/${id}/leave`, {}, { withCredentials: true });
  }

  getCurrentUser(): Observable<IUser> {
    return this.http.get<IUser>('/api/users/me');
  }
}
