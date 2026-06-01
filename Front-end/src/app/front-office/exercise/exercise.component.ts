import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IExercise } from '../../models/IExercise';
import { IExerciseResponse } from '../../models/IExerciseResponse';
import { ExerciseService } from '../../services/exercise.service';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchBarComponent],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.css'
})
export class ExerciseComponent implements OnInit {
  exercises: IExercise[] = [];
  currentPage  = 1;
  pageSize     = 20;
  totalCount   = 0;
  totalPages   = 0;
  isLoading    = true;

  private searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.loadPage(1);
    });

    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.isLoading = true;
    this.currentPage = page;

    if (this.searchTerm.trim()) {
      this.exerciseService.searchByName(this.searchTerm).subscribe({
        next: (results: any) => {
          this.exercises  = Array.isArray(results) ? results : (results.data ?? []);
          this.totalCount = this.exercises.length;
          this.totalPages = 1;
          this.isLoading  = false;
        },
        error: () => { this.exercises = []; this.isLoading = false; }
      });
    } else {
      const offset = (page - 1) * this.pageSize;
      this.exerciseService.getExercises(this.pageSize, offset).subscribe({
        next: (response: IExerciseResponse) => {
          if (response?.results && Array.isArray(response.results)) {
            this.exercises  = response.results;
            this.totalCount = response.count;
            this.totalPages = Math.ceil(this.totalCount / this.pageSize);
          } else {
            this.exercises = [];
          }
          this.isLoading = false;
        },
        error: () => { this.exercises = []; this.isLoading = false; }
      });
    }
  }

  onSearch(term: string): void {
    this.searchSubject.next(term);
  }

  previousPage(): void { if (this.currentPage > 1) this.loadPage(this.currentPage - 1); }
  nextPage(): void     { if (this.currentPage < this.totalPages) this.loadPage(this.currentPage + 1); }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) this.loadPage(page);
  }

  getPageNumbers(): number[] {
    const maxVisible = 5;
    const start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end   = Math.min(this.totalPages, start + maxVisible - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  trackByFn(_: number, item: IExercise): string { 
    return item.id; 
  }
}