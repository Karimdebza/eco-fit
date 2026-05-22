import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-subscreption',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './subscreption.component.html',
  styleUrl: './subscreption.component.css'
})
export class SubscreptionComponent {
  isLoading = false;

  freeFeatures = [
    'Accès aux exercices',
    'Tracker calorique (7 entrées/jour)',
    'Consultation des événements',
    'Profil de base',
  ];

  proFeatures = [
    'Tout le plan Gratuit',
    'Tracker calorique illimité',
    'Programmes personnalisés',
    'Participation aux événements',
    'Historique complet',
    'Support prioritaire',
  ];

  eliteFeatures = [
    'Tout le plan Pro',
    'Coach personnel dédié',
    'Programmes sur mesure',
    'Accès partenaires premium',
    'Badge Élite sur le profil',
    'Accès anticipé aux nouveautés',
  ];
}