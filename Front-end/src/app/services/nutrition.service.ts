// Front-end/src/app/services/nutrition.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface NutritionEntry {
  id: number;
  ingredient_id: string;
  ingredient_name: string;
  quantity_g: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

export interface DayTotals {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface JournalResponse {
  status: string;
  data: {
    date: string;
    totals: DayTotals;
    meals: {
      breakfast: NutritionEntry[];
      lunch: NutritionEntry[];
      dinner: NutritionEntry[];
      snack: NutritionEntry[];
    };
    entries: NutritionEntry[];
  };
}

export interface AddEntryDTO {
ingredient_id: string;
  ingredient_name: string;
  quantity_g: number;
  energy_per100: number;
  protein_per100: number;
  carbs_per100: number;
  fat_per100: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

@Injectable({ providedIn: 'root' })
export class NutritionService {
  private base = `${environment.apiUrl}/nutrition`;

  constructor(private http: HttpClient) {}

  getJournal(date: string): Observable<JournalResponse> {
    return this.http.get<JournalResponse>(
      `${this.base}/journal?date=${date}`,
      { withCredentials: true }
    );
  }

  addEntry(dto: AddEntryDTO): Observable<any> {
    return this.http.post(`${this.base}`, dto, { withCredentials: true });
  }

  deleteEntry(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`, { withCredentials: true });
  }

  getHistory(days = 7): Observable<{ status: string; data: Record<string, number> }> {
    return this.http.get<any>(
      `${this.base}/history?days=${days}`,
      { withCredentials: true }
    );
  }
}