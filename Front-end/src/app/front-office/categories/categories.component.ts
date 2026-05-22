import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../static/header/header.component';
import { FooterComponent } from '../../static/footer/footer.component';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';

@Component({
  selector: 'app-categories',
  standalone: true,
imports: [CommonModule, HeaderComponent, FooterComponent, SearchBarComponent, RouterModule,RouterLinkActive],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {


  onSearch(term: string) {
    console.log('Search:', term);
  }
}