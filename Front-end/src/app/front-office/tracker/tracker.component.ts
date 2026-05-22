// Front-end/src/app/front-office/tracker/tracker.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { OpenFoodFactsService } from '../../services/open-food-facts.service';
import { NormalizedFood } from '../../models/IOpenFoodFacts';
import { NutritionService, NutritionEntry, DayTotals, AddEntryDTO } from '../../services/nutrition.service';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface MealConfig { key: MealType; label: string; icon: string; }

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css'
})
export class TrackerComponent implements OnInit, OnDestroy {

  Math = Math;

  // --- Date ---
  currentDate = new Date().toISOString().split('T')[0];

  // --- Objectif ---
  calorieGoal = 2000;
  editingGoal = false;
  tempGoal    = 2000;

  // --- Journal ---
  totals: DayTotals = { calories: 0, protein: 0, carbohydrates: 0, fat: 0 };
  meals: Record<MealType, NutritionEntry[]> = {
    breakfast: [], lunch: [], dinner: [], snack: []
  };
  isLoadingJournal = false;

  // --- Recherche OFF ---
  searchQuery    = '';
  searchResults: NormalizedFood[] = [];
  isSearching    = false;
  showResults    = false;
  private search$ = new Subject<string>();
  private subs    = new Subscription();

  // --- Modal ---
  showModal        = false;
  selectedFood: NormalizedFood | null = null;
  selectedMeal: MealType = 'snack';
  quantity         = 100;

  // --- Historique ---
  history: { date: string; calories: number }[] = [];
  maxHistoryCalories = 1;

  mealConfigs: MealConfig[] = [
    { key: 'breakfast', label: 'Petit-déjeuner', icon: '🌅' },
    { key: 'lunch',     label: 'Déjeuner',       icon: '☀️' },
    { key: 'dinner',    label: 'Dîner',           icon: '🌙' },
    { key: 'snack',     label: 'Collation',       icon: '🍎' },
  ];

  constructor(
    private offService: OpenFoodFactsService,
    private nutritionService: NutritionService
  ) {}

  ngOnInit() {
    this.loadJournal();
    this.loadHistory();

    // Debounce 400ms — évite un appel OFF à chaque keystroke
    this.subs.add(
      this.search$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => {
          this.isSearching = true;
          return this.offService.search(term, 8);
        })
      ).subscribe({
        next: results => {
          this.searchResults = results;
          this.isSearching   = false;
          this.showResults   = results.length > 0;
        },
        error: () => { this.isSearching = false; }
      })
    );
  }

  ngOnDestroy() { this.subs.unsubscribe(); }

  // --- Recherche ---
  onSearchInput() {
    const term = this.searchQuery.trim();
    if (term.length < 2) {
      this.searchResults = [];
      this.showResults   = false;
      return;
    }
    this.isSearching = true;
    this.search$.next(term);
  }

  selectFood(food: NormalizedFood) {
    this.selectedFood  = food;
    this.searchQuery   = food.name;
    this.showResults   = false;
    this.quantity      = 100;
    this.showModal     = true;
  }

  closeModal() {
    this.showModal    = false;
    this.selectedFood = null;
    this.searchQuery  = '';
  }

  // --- Date ---
  prevDay() {
    const d = new Date(this.currentDate);
    d.setDate(d.getDate() - 1);
    this.currentDate = d.toISOString().split('T')[0];
    this.loadJournal();
  }

  nextDay() {
    const d = new Date(this.currentDate);
    d.setDate(d.getDate() + 1);
    this.currentDate = d.toISOString().split('T')[0];
    this.loadJournal();
  }

  isToday(): boolean {
    return this.currentDate === new Date().toISOString().split('T')[0];
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00')
      .toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  // --- Journal ---
  loadJournal() {
    this.isLoadingJournal = true;
    this.nutritionService.getJournal(this.currentDate).subscribe({
      next: res => {
        this.totals = res.data.totals;
        this.meals  = res.data.meals;
        this.isLoadingJournal = false;
      },
      error: () => { this.isLoadingJournal = false; }
    });
  }

  // --- Gauge ---
  get caloriePercent(): number {
    return Math.min((this.totals.calories / this.calorieGoal) * 100, 100);
  }
  get gaugeColor(): string {
    const p = this.caloriePercent;
    if (p >= 100) return '#D62828';
    if (p >= 85)  return '#F77F00';
    return '#52B788';
  }
  get circumference(): number { return 2 * Math.PI * 54; }
  get strokeDashoffset(): number {
    return this.circumference - (this.caloriePercent / 100) * this.circumference;
  }

  // --- Objectif ---
  startEditGoal() { this.tempGoal = this.calorieGoal; this.editingGoal = true; }
  saveGoal()      { this.calorieGoal = this.tempGoal; this.editingGoal = false; }

  // --- Preview modal ---
  get previewCalories(): number {
    return Math.round((this.selectedFood?.energy ?? 0) * this.quantity / 100);
  }
  get previewProtein(): number {
    return Math.round((this.selectedFood?.protein ?? 0) * this.quantity / 100 * 10) / 10;
  }
  get previewCarbs(): number {
    return Math.round((this.selectedFood?.carbohydrates ?? 0) * this.quantity / 100 * 10) / 10;
  }
  get previewFat(): number {
    return Math.round((this.selectedFood?.fat ?? 0) * this.quantity / 100 * 10) / 10;
  }

  // --- Ajout journal ---
  addToJournal() {
    if (!this.selectedFood || !this.quantity) return;

    const dto: AddEntryDTO = {
  ingredient_id: this.selectedFood.id, 
      ingredient_name: this.selectedFood.name,
      quantity_g:      this.quantity,
      energy_per100:   this.selectedFood.energy,
      protein_per100:  this.selectedFood.protein,
      carbs_per100:    this.selectedFood.carbohydrates,
      fat_per100:      this.selectedFood.fat,
      meal_type:       this.selectedMeal,
      date:            this.currentDate,
    };

    this.nutritionService.addEntry(dto).subscribe({
      next: () => { this.closeModal(); this.loadJournal(); }
    });
  }

  deleteEntry(id: number) {
    this.nutritionService.deleteEntry(id).subscribe({
      next: () => this.loadJournal()
    });
  }

  mealCalories(meal: MealType): number {
    return Math.round(this.meals[meal].reduce((s, e) => s + e.calories, 0));
  }

  // --- Historique ---
  loadHistory() {
    this.nutritionService.getHistory(7).subscribe({
      next: res => {
        this.history = Object.entries(res.data)
          .map(([date, calories]) => ({ date, calories: calories as number }))
          .sort((a, b) => a.date.localeCompare(b.date));
        this.maxHistoryCalories = Math.max(
          ...this.history.map(h => h.calories), this.calorieGoal
        );
      }
    });
  }

  historyBarHeight(cal: number): number {
    return Math.round((cal / this.maxHistoryCalories) * 100);
  }

  historyBarColor(cal: number): string {
    const pct = (cal / this.calorieGoal) * 100;
    if (pct >= 100) return 'bg-red-400';
    if (pct >= 85)  return 'bg-energy';
    return 'bg-accent';
  }

  formatShortDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00')
      .toLocaleDateString('fr-FR', { weekday: 'short' });
  }
}