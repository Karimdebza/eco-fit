import { Component,OnInit } from '@angular/core';
import { IAliment } from '../../models/IAlimentation';
import { AlimentationService } from '../../services/alimentation.service';


import { CommonModule } from '@angular/common';

import { IAlimentResponse } from '../../models/IAlimentResponse';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-food-list',
  standalone: true,
  imports: [CommonModule,RouterLink],
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
  nextUrl: string | null = null;
  previousUrl: string | null = null;

  constructor(private alimentService: AlimentationService) {}

  ngOnInit() {
    console.log('Composant initialisé, chargement des données...');
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.currentPage = page;

    // Calculer l'offset pour l'API
    const offset = (page - 1) * this.pageSize;
    
    this.alimentService.getAliments(this.pageSize, offset).subscribe({
      next: (response: IAlimentResponse) => {
    
        if (response && response.results && Array.isArray(response.results)) {
          this.aliments = response.results;
          this.totalCount = response.count;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
          this.nextUrl = response.next;
          this.previousUrl = response.previous;
          
          console.log('✅ Données chargées avec succès:');
    
        } else {
          console.warn('❌ Format de réponse inattendu:', response);
          this.aliments = [];
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement:', err);
        this.isLoading = false;
        this.aliments = [];
      }
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }

  // Pour les numéros de page
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

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadPage(page);
    }
  }

   trackByFn(index: number, item: IAliment): number {
    return item.id;
  }

}
