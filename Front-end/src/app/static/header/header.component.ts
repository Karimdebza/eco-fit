import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userPicture: string | null = null;
  showMobileMenu = false;

  constructor(
    private userService: UserService,
    private userStore: UserStoreService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('user_id');
    this.userPicture = localStorage.getItem('user_picture');
  }
  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
