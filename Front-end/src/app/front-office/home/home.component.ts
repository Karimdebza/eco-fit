import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  carouselImages = [
    {
      title: "Transforme ton corps, respecte la planète",
      description: "Avec Eco-Fit, entraîne-toi efficacement tout en adoptant un mode de vie durable.",
      buttonText: "Découvrir les programmes",
      buttonUrl: "/categories",
      image: "images/home/carousel1.jpg"
    },
    {
      title: "Programmes personnalisés & écoresponsables",
      description: "Atteins tes objectifs grâce à nos plans d'entraînement intelligents.",
      buttonText: "Voir les exercices",
      buttonUrl: "/exercises",
      image: "images/home/car2.jpg"
    },
    {
      title: "Rejoins une communauté engagée",
      description: "Partage tes progrès, motive les autres, et avance vers un futur plus sain.",
      buttonText: "Voir les événements",
      buttonUrl: "/event",
      image: "images/home/car3.jpg"
    }
  ];

  features = [
    {
      icon: '🏋️',
      title: 'Exercices',
      description: 'Des milliers d\'exercices guidés adaptés à ton niveau et tes objectifs.',
      route: '/exercises',
      image: 'images/home/exercice.avif',
      cta: 'Explorer'
    },
    {
      icon: '🥗',
      title: 'Nutrition',
      description: 'Suis ton alimentation et atteins tes objectifs caloriques au quotidien.',
      route: '/alimentation',
      image: 'images/home/alimentation.avif',
      cta: 'Découvrir'
    },
    {
      icon: '📅',
      title: 'Événements',
      description: 'Participe à des événements sportifs locaux et éco-responsables.',
      route: '/event',
      image: 'images/home/event.avif',
      cta: 'Voir les événements'
    },
    {
      icon: '🤝',
      title: 'Partenaires',
      description: 'Des partenaires engagés dans une démarche éco-responsable.',
      route: '/partner',
      image: 'images/home/partenaire.avif',
      cta: 'Nos partenaires'
    }
  ];

  stats = [
    { value: '10K+', label: 'Membres actifs' },
    { value: '500+', label: 'Exercices disponibles' },
    { value: '50+', label: 'Événements par an' },
    { value: '100%', label: 'Éco-responsable' },
  ];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}