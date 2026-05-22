import { Component, OnInit } from '@angular/core';
import { IExercise } from '../../models/IExercise';
import { ExerciseService } from '../../services/exercise.service';
import { CommonModule } from '@angular/common';
import { IExerciseResponse } from '../../models/IExerciseResponse';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.css'
})
export class ExerciseComponent implements OnInit {

  exercises: IExercise[] = [];
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  isLoading = true;
  nextUrl: string | null = null;
  previousUrl: string | null = null;

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit(): void {
    console.log('Chargement des exercices...');
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.isLoading = true;
    this.currentPage = page;
    const offset = (page - 1) * this.pageSize;

    this.exerciseService.getExercises(this.pageSize, offset).subscribe({
      next: (response: IExerciseResponse) => {
        if (response && Array.isArray(response.results)) {
          this.exercises = response.results;
          this.totalCount = response.count;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
          this.nextUrl = response.next;
          this.previousUrl = response.previous;
          console.log('✅ Exercices chargés');
        } else {
          console.warn('❌ Format inattendu', response);
          this.exercises = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement exercices:', err);
        this.exercises = [];
        this.isLoading = false;
        
      }
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadPage(page);
    }
  }

  trackByFn(index: number, item: IExercise): number {
    return item.id;
  }
}
