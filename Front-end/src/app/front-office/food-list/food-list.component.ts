import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IAliment } from '../../models/IAlimentation';
import { IAlimentResponse } from '../../models/IAlimentResponse';
import { AlimentationService } from '../../services/alimentation.service';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';

@Component({
  selector: 'app-food-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchBarComponent],
  templateUrl: './food-list.component.html',
  styleUrl: './food-list.component.css'
})
export class FoodListComponent implements OnInit {
  aliments: IAliment[] = [];
  currentPage = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 0;
  isLoading = true;

  constructor(
    private alimentService: AlimentationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.currentPage = page;
    const offset = (page - 1) * this.pageSize;

    this.alimentService.getAliments(this.pageSize, offset).subscribe({
      next: (response: IAlimentResponse) => {
        if (response?.results && Array.isArray(response.results)) {
          this.aliments = response.results;
          this.totalCount = response.count;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        } else {
          this.aliments = [];
        }
        this.isLoading = false;
      },
      error: () => {
        this.aliments = [];
        this.isLoading = false;
      }
    });
  }

  onSearch(term: string) {
    if (!term) { this.loadPage(1); return; }
    this.isLoading = true;
    this.alimentService.getAliments(50, 0).subscribe({
      next: (res) => {
        const filtered = res.results.filter(a =>
          a.name?.toLowerCase().includes(term.toLowerCase())
        );
        this.aliments = filtered;
        this.totalCount = filtered.length;
        this.totalPages = 1;
        this.currentPage = 1;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  previousPage() { if (this.currentPage > 1) this.loadPage(this.currentPage - 1); }
  nextPage() { if (this.currentPage < this.totalPages) this.loadPage(this.currentPage + 1); }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) this.loadPage(page);
  }

  getPageNumbers(): number[] {
    const maxVisible = 5;
    const start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  navigateTo(route: string) { this.router.navigateByUrl(route); }

  trackByFn(_: number, item: IAliment): number { return item.id; }
}