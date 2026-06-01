import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { OpenFoodFactsService } from '../../services/open-food-facts.service';
import { NormalizedFood } from '../../models/IOpenFoodFacts';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';

@Component({
  selector: 'app-food-list',
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  templateUrl: './food-list.component.html',
  styleUrl: './food-list.component.css'
})
export class FoodListComponent {
  foods: NormalizedFood[] = [];
  isLoading = false;
  hasSearched = false;

  private search$ = new Subject<string>();

  constructor(
    private off: OpenFoodFactsService,
    private router: Router
  ) {
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        this.isLoading = true;
        return this.off.search(term, 24);
      })
    ).subscribe({
      next: results => {
        this.foods     = results;
        this.isLoading = false;
        this.hasSearched = true;
      },
      error: () => { this.isLoading = false; }
    });
  }

  onSearch(term: string): void {
    if (!term.trim()) {
      this.foods = [];
      this.hasSearched = false;
      return;
    }
    this.search$.next(term);
  }

  goToDetail(food: NormalizedFood): void {
    // On passe l'id OFF en paramètre — c'est un string (barcode)
    this.router.navigate(['/alimentation', food.id]);
  }

  trackByFn(_: number, item: NormalizedFood): string { return item.id; }
}