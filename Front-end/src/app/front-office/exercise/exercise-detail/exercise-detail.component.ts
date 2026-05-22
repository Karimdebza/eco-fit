import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { IExercise } from '../../../models/IExercise';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ISingleExerciseResponse } from '../../../models/ISingleExerciseResponse';

@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './exercise-detail.component.html',
  styleUrl: './exercise-detail.component.css'
})
export class ExerciseDetailComponent implements OnInit {

  exerciseId!: number;
  exercise?: IExercise;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private exerciseService: ExerciseService
  ) {}

  ngOnInit(): void {
    this.exerciseId = Number(this.route.snapshot.paramMap.get('id'));
    this.getExercise();
  }

  getExercise(): void {
    this.exerciseService.getExerciseById(this.exerciseId).subscribe({
      next: (response:ISingleExerciseResponse ) => {
        const data = response.data;
        // sécuriser les tableaux
        data.images = data.images ?? [];
        data.videos = data.videos ?? [];
        data.muscles = data.muscles ?? [];
        data.muscles_secondary = data.muscles_secondary ?? [];
        data.equipment = data.equipment ?? [];

        this.exercise = data;
        this.loading = false;
        console.log('✅ Exercice chargé:', this.exercise);
      },
      error: err => {
        this.error = 'Erreur lors du chargement de l\'exercice';
        console.error('Erreur:', err);
        this.loading = false;
      }
    });
  }

}
