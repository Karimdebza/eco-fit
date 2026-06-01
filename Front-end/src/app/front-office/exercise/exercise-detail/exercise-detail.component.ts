import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { IExercise } from '../../../models/IExercise';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ISingleExerciseResponse } from '../../../models/ISingleExerciseResponse';

@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './exercise-detail.component.html',
  styleUrl: './exercise-detail.component.css'
})
export class ExerciseDetailComponent implements OnInit {

  exerciseId!: string;
  exercise?: IExercise;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private exerciseService: ExerciseService
  ) {}

  ngOnInit(): void {
    // L'ID est maintenant une string
    this.exerciseId = this.route.snapshot.paramMap.get('id') || '';
    if(this.exerciseId) {
      this.getExercise();
    }
  }

  getExercise(): void {
    this.exerciseService.getExerciseById(this.exerciseId).subscribe({
      next: (response: ISingleExerciseResponse) => {
        const data = response.data;
        // Sécuriser les nouveaux tableaux
        data.images = data.images ?? [];
        data.primaryMuscles = data.primaryMuscles ?? [];
        data.secondaryMuscles = data.secondaryMuscles ?? [];
        data.instructions = data.instructions ?? [];
        
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