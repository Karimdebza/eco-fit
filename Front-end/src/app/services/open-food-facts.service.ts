// Front-end/src/app/services/open-food-facts.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime } from 'rxjs/operators';
import { OFFSearchResponse, OFFProduct, NormalizedFood } from '../models/IOpenFoodFacts';
@Injectable({ providedIn: 'root' })
export class OpenFoodFactsService {

  // On passe par le proxy back pour éviter les problèmes CORS en prod
  // En dev Angular tourne sur 4200, l'API OFF sur un domaine différent
  private readonly BASE = 'https://world.openfoodfacts.org';
  private readonly FIELDS = 'id,product_name,image_url,nutriments';

  constructor(private http: HttpClient) {}

  /**
   * Recherche par nom — retourne des NormalizedFood
   * L'API OFF accepte les requêtes cross-origin, pas besoin de proxy
   */
  search(term: string, pageSize = 10): Observable<NormalizedFood[]> {
    if (!term.trim()) return of([]);

    const url = `${this.BASE}/cgi/search.pl` +
      `?search_terms=${encodeURIComponent(term)}` +
      `&json=1&page_size=${pageSize}` +
      `&fields=${this.FIELDS}` +
      `&lc=fr`;  // priorité langue française

    return this.http.get<OFFSearchResponse>(url).pipe(
      map(res => this.normalizeProducts(res.products ?? [])),
      catchError(() => of([])) // si l'API est down, retourne tableau vide
    );
  }

  /**
   * Récupère un produit par barcode/id
   */
  getById(id: string): Observable<NormalizedFood | null> {
    const url = `${this.BASE}/api/v2/product/${id}?fields=${this.FIELDS}`;

    return this.http.get<{ product: OFFProduct }>(url).pipe(
      map(res => res.product ? this.normalize(res.product) : null),
      catchError(() => of(null))
    );
  }

  // --- Normalisation ---
  private normalizeProducts(products: OFFProduct[]): NormalizedFood[] {
    return products
      .filter(p => p.product_name?.trim()) // retire les produits sans nom
      .map(p => this.normalize(p));
  }

  private normalize(p: OFFProduct): NormalizedFood {
    const n = p.nutriments ?? {};
    return {
      id:            p.id,
      name:          p.product_name?.trim() ?? 'Inconnu',
      image:         p.image_url,
      energy:        Math.round(n['energy-kcal_100g'] ?? 0),
      protein:       this.round(n['proteins_100g'] ?? 0),
      carbohydrates: this.round(n['carbohydrates_100g'] ?? 0),
      fat:           this.round(n['fat_100g'] ?? 0),
      fiber:         this.round(n['fiber_100g'] ?? 0),
    };
  }

  private round(val: number): number {
    return Math.round(val * 10) / 10;
  }
}