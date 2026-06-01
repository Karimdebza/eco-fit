import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OpenFoodFactsService } from '../../../services/open-food-facts.service';
import { NutritionService, AddEntryDTO } from '../../../services/nutrition.service';
import { NormalizedFood } from '../../../models/IOpenFoodFacts';

@Component({
  selector: 'app-food-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './food-detail.component.html',
  styleUrl: './food-detail.component.css'
})
export class FoodDetailComponent implements OnInit {
  food: NormalizedFood | null = null;
  loading = true;
  error: string | null = null;

  // Formulaire ajout tracker
  quantity   = 100;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'lunch';
  date       = new Date().toISOString().split('T')[0];
  addSuccess = false;
  addError   = false;
  isAdding   = false;

  constructor(
    private route: ActivatedRoute,
    private off: OpenFoodFactsService,
    private nutritionService: NutritionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.off.getById(id).subscribe({
      next: food => {
        this.food    = food;
        this.loading = false;
        if (!food) this.error = 'Aliment introuvable.';
      },
      error: () => {
        this.error   = 'Erreur lors du chargement.';
        this.loading = false;
      }
    });
  }

  // Calcule les macros selon la quantité saisie
  calc(per100: number): number {
    return Math.round((per100 * this.quantity / 100) * 10) / 10;
  }

  addToTracker(): void {
    if (!this.food || this.quantity <= 0) return;
    this.isAdding  = true;
    this.addSuccess = false;
    this.addError   = false;

    const dto: AddEntryDTO = {
      ingredient_id:   this.food.id,
      ingredient_name: this.food.name,
      quantity_g:      this.quantity,
      energy_per100:   this.food.energy,
      protein_per100:  this.food.protein,
      carbs_per100:    this.food.carbohydrates,
      fat_per100:      this.food.fat,
      meal_type:       this.meal_type,
      date:            this.date,
    };

    this.nutritionService.addEntry(dto).subscribe({
      next: () => {
        this.addSuccess = true;
        this.isAdding   = false;
      },
      error: () => {
        this.addError = true;
        this.isAdding = false;
      }
    });
  }

  mealLabel(m: string): string {
    return { breakfast: 'Petit-déjeuner', lunch: 'Déjeuner', dinner: 'Dîner', snack: 'Collation' }[m] ?? m;
  }
}