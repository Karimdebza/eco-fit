import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IEvent } from '../../../models/IEvent';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: IEvent[] = [];
  isLoading = true;

  constructor(private eventService: EventService) {}

  ngOnInit(): void { this.loadEvents(); }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents().subscribe({
      next: (events) => { this.events = events; this.isLoading = false; },
      error: () => { this.events = []; this.isLoading = false; }
    });
  }

  deleteEvent(id: number): void {
    this.eventService.deleteEvent(id).subscribe({
      next: () => this.loadEvents()
    });
  }
}