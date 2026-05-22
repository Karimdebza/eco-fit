import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { IAliment } from '../../models/IAlimentation';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { AlimentationService } from '../../services/alimentation.service';

@Component({
  selector: 'app-alimentation',
  standalone: true,
  imports: [NgIf, NgFor, SearchBarComponent],
  templateUrl: './alimentation.component.html',
  styleUrl: './alimentation.component.css',
})
export class AlimentationComponent implements OnInit {
  aliments: IAliment[] = [];
  pagedAliments: IAliment[] = [];
  currentPage = 1;
  pageSize = 6;
  totalPages = 0;
  pages: (number | string)[] = [];

  constructor(private alimentationService: AlimentationService) {}

  ngOnInit(): void {
    this.alimentationService.getAliments().subscribe({
      next: (data) => {
        this.aliments = data;
        this.totalPages = Math.ceil(this.aliments.length / this.pageSize);
        this.setPage(1);
      },
      error: (err) => console.error(err),
    });
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedAliments = this.aliments.slice(start, end);
    this.updatePages();
  }

  previousPage(): void {
    if (this.currentPage > 1) this.setPage(this.currentPage - 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.setPage(this.currentPage + 1);
  }

  updatePages(): void {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const range: number[] = [];
    const result: (number | string)[] = [];

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    let last = 0;
    for (const page of range) {
      if (page - last > 1) result.push('...');
      result.push(page);
      last = page;
    }

    this.pages = result;
  }

  onPageClick(page: number | string): void {
    if (typeof page === 'number') this.setPage(page);
  }

  searchAliments(term: string): void {
    this.alimentationService.searchByName(term).subscribe({
      next: (results) => {
        this.aliments = results;
        this.totalPages = Math.ceil(this.aliments.length / this.pageSize);
        this.setPage(1);
      },
      error: (err) => console.error(err),
    });
  }
}
