import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ISubscription } from '../models/ISubscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  constructor(private http: HttpClient) {}

  getSubscriptions(): Observable<ISubscription[]> {
    return this.http.get<ISubscription[]>(`${environment.apiUrl}/subscriptions`);
  }

  getSubscriptionById(id: number): Observable<ISubscription> {
    return this.http.get<ISubscription>(`${environment.apiUrl}/subscriptions/${id}`);
  }

  addSubscription(subscription: ISubscription): Observable<ISubscription> {
    return this.http.post<ISubscription>(`${environment.apiUrl}/subscriptions`, subscription);
  }

  updateSubscription(subscription: ISubscription): Observable<ISubscription> {
    return this.http.put<ISubscription>(`${environment.apiUrl}/subscriptions/${subscription.id_subscription}`, subscription);
  }

  deleteSubscription(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/subscriptions/${id}`);
  }

  renewSubscription(id: number): Observable<ISubscription> {
    return this.http.put<ISubscription>(`${environment.apiUrl}/subscriptions/${id}/renew`, {});
  }

  cancelSubscription(id: number): Observable<ISubscription> {
    return this.http.put<ISubscription>(`${environment.apiUrl}/subscriptions/${id}/cancel`, {});
  }
}
