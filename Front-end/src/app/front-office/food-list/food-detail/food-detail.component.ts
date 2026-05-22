import { Component,OnInit } from '@angular/core';
import { IAliment} from '../../../models/IAlimentation';
import { AlimentationService} from '../../../services/alimentation.service';
import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-food-detail',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './food-detail.component.html',
  styleUrl: './food-detail.component.css'
})
export class FoodDetailComponent implements OnInit {

   alimentId!: number;
  aliment?: IAliment;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private alimentationService: AlimentationService,
  ) {}

  ngOnInit(): void {
    this.alimentId = Number(this.route.snapshot.paramMap.get('id'));
    this.getIngredient();
  }

  getIngredient() {
    this.alimentationService.getAlimentById(this.alimentId)
      .subscribe( {next: data => {
        this.aliment = data;
        this.loading = false;
      },
        error: err => {
          this.error = 'Erreur lors du chargement de l\'aliment';
          console.error('Erreur:', err);
          this.loading = false;
        }
      }
        
        
);
      
  }
}
