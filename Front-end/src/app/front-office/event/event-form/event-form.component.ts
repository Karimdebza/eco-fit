import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { EventService } from '../../../services/event.service';
import { IEvent } from '../../../models/IEvent';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  form!: FormGroup;
  eventId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventId = +id;
      this.eventService.getEventById(this.eventId).subscribe(event => {
        this.form.patchValue(event);
      });
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date_of_event: ['', Validators.required],
      place: ['', Validators.required],
      themes: [''],
      image: [''],
      nombre_of_participant: [0],
      rating: [0],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const payload = this.form.value as IEvent;

    const request = this.eventId
      ? this.eventService.updateEvent({ ...payload, id_event: this.eventId })
      : this.eventService.addEvent(payload);

    request.subscribe({
      next: () => this.router.navigate(['/event']),
      error: err => console.error('Erreur création/modification :', err)
    });
  }
}
