import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../models/IUser';
import { EventService } from './event.service';

@Injectable({ providedIn: 'root' })
export class UserStoreService {
  private userSubject = new BehaviorSubject<IUser | null>(null);

  constructor(private eventService: EventService) {}

  getUser(): Observable<IUser | null> {
    if (!this.userSubject.value) {
      this.eventService.getCurrentUser().subscribe({
        next: user => this.userSubject.next(user),
        error: () => this.userSubject.next(null)
      });
    }
    return this.userSubject.asObservable();
  }
  updatePicture(picture: string): void {
    const user = this.userSubject.value;
    if (user) {
      this.userSubject.next({ ...user, picture });
    }
  }
  

  setUser(user: IUser): void {
    this.userSubject.next(user);
  }

  clearUser(): void {
    this.userSubject.next(null);
  }
}
