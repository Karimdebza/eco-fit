import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { IEvent } from '../../../models/IEvent';
import { IUser } from '../../../models/IUser';
import { EventService } from '../../../services/event.service';
import { UserService } from '../../../services/user.service';
import { UserStoreService } from '../../../services/user-store.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: IEvent | null = null;
  user: IUser | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private userService: UserService,
    private userStore: UserStoreService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadEvent(id);
    }

    try {
      const storedUser = await firstValueFrom(this.userStore.getUser());
      if (storedUser) {
        this.user = storedUser;
      } else {
        const res = await firstValueFrom(this.userService.getCurrentUser());
        if (res.status === 'success') {
          this.user = res.data;
          this.userStore.setUser(this.user);
        }
      }
    } catch (err) {
      console.error('Erreur de récupération utilisateur', err);
      this.user = null;
      this.userStore.clearUser();
    }
  }

  loadEvent(id: number): void {
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        console.log('Événement chargé :', event);
      },
      error: (err) => console.error('Erreur chargement événement :', err)
    });
  }

  joinEvent(): void {
    if (!this.event || !this.user) return;

    this.user.id_adventure = this.event.id_event;

    this.eventService.joinEvent(this.event.id_event).subscribe({
      next: (updatedUser) => {
        console.log('Rejoint avec succès', updatedUser);
        this.userStore.setUser({ ...this.user! });
      },
      error: (err) => {
        console.error('Erreur lors de l inscription :', err);
        this.user!.id_adventure = null;
      }
    });
  }

  leaveEvent(): void {
    if (!this.event || !this.user) return;

    this.user.id_adventure = null;

    this.eventService.leaveEvent(this.event.id_event).subscribe({
      next: (user) => {
        console.log('Quitter avec succès', user);
        this.userStore.setUser({ ...this.user! });
      },
      error: (err) => {
        console.error('Erreur lors de la désinscription :', err);
        this.user!.id_adventure = this.event!.id_event;
      }
    });
  }
}
