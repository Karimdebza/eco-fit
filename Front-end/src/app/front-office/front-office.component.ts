import { Component } from '@angular/core';
import { HeaderComponent } from '../static/header/header.component';
import { FooterComponent } from '../static/footer/footer.component';
import { CommonModule } from '@angular/common';

import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-front-office',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,

    RouterOutlet
  ],
  templateUrl: './front-office.component.html',
  styleUrls: ['./front-office.component.css']
})
export class FrontOfficeComponent {
 showHeaderFooter = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const hideOnRoutes = ['/signup', '/signin'];

        // Si la route actuelle est dans cette liste, on cache, sinon on affiche
        this.showHeaderFooter = !hideOnRoutes.includes(event.urlAfterRedirects);
      });
  }
  onActivate(event: any) {
  // event est le composant chargé
  console.log('Activated component:', event);
}
}
