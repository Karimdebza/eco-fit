import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrls:[ './home.component.css']
})
export class HomeComponent {
   carouselImages = [
  {
    title: "Transforme ton corps, respecte la planète",
    description: "Avec Eco Fit, entraîne-toi efficacement tout en adoptant un mode de vie durable.",
    buttonText: "En savoir plus",
    buttonUrl: "/about-us",
    image: "images/home/eco1.jpg"
  },
  {
    title: "Programmes personnalisés & écoresponsables",
    description: "Atteins tes objectifs grâce à nos plans d’entraînement intelligents et respectueux de l’environnement.",
    buttonText: "En savoir plus",
    buttonUrl: "/about-us",
    image: "images/home/car2.jpg"
  },
  {
    title: "Rejoins une communauté engagée",
    description: "Partage tes progrès, motive les autres, et avance ensemble vers un futur plus sain.",
    buttonText: "En savoir plus",
    buttonUrl: "/about-us",
    image: "images/home/car3.jpg"
  }
];


   cardImages = [
    { name: 'Partenaire', image: 'images/home/partenaire.avif', route: '/partner' },
    { name: 'Event', image: 'images/home/event.avif', route: '/event' },
    { name: 'Abonnement', image: 'images/home/abonnement.avif', route: '/subscreption' },
    { name: 'Programme', image: 'images/home/programe.jpg', route: '/categories' }
  ];

  constructor(private router: Router) {}
  onSearch(term: string) {
    console.log('Search term:', term);
  }

    navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
