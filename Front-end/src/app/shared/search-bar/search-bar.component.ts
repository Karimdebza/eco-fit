import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Input() placeholder = 'Rechercher...';
  @Output() searchEvent = new EventEmitter<string>();

  searchTerm = '';

  onSearch() {
    this.searchEvent.emit(this.searchTerm.trim());
  }

  // Reset si l'utilisateur vide le champ
  onInputChange() {
    if (this.searchTerm.trim() === '') {
      this.searchEvent.emit('');
    }
  }
}