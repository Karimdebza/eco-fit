import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { IUser } from '../../models/IUser';
import { UserService } from '../../services/user.service';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  profileForm!: FormGroup;
  userData!: IUser;
  isEditing = false;
  isLoading = true;
  previewUrl: string | null = null;
  avatarOptions: string[] = [];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private userStore: UserStoreService
  ) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('user_id'));
    if (!userId || isNaN(userId)) {
      this.router.navigate(['/signin']);
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (response) => {
        this.userData = response.data;
        const seed = this.userData.email || `${this.userData.first_name}${this.userData.last_name}`;
        this.generateAvatarOptions(seed);
        this.initForm(this.userData);
        this.previewUrl = this.userData.picture || this.avatarOptions[0];
        this.isLoading = false;
      },
      error: () => {
        localStorage.clear();
        this.router.navigate(['/signin']);
      }
    });
  }

  generateAvatarOptions(seedBase: string): void {
    this.avatarOptions = Array.from({ length: 8 }, (_, i) =>
      `https://robohash.org/${encodeURIComponent(seedBase + i)}?size=200x200`
    );
  }

  initForm(user: IUser): void {
    this.profileForm = this.fb.group({
      first_name: [user.first_name, Validators.required],
      last_name: [user.last_name, Validators.required],
      email: [{ value: user.email, disabled: true }],
      number_of_phone: [user.number_of_phone],
      age: [user.age],
      height: [user.height],
      size: [user.size],
      disability_type: [user.disability_type],
      picture: [user.picture || this.avatarOptions[0]]
    });
    this.profileForm.disable();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.isEditing ? this.profileForm.enable() : this.profileForm.disable();
  }

  selectAvatar(url: string): void {
    this.previewUrl = url;
    this.profileForm.get('picture')?.setValue(url);
  }

onSubmit(): void {
  if (this.profileForm.valid) {
    const updatedUser: IUser = {
      ...this.userData,
      ...this.profileForm.getRawValue(),
    
      picture: this.previewUrl ?? ''
    };

    this.userService.updateUser(updatedUser).subscribe({
  next: () => {
    alert('Profil mis à jour');
    this.isEditing = false;
    this.profileForm.disable();

    const picture = updatedUser.picture || '';
    localStorage.setItem('user_picture', picture);
    this.userStore.updatePicture(picture); // ✅ Ajoute ceci
  },
  error: () => alert('Erreur lors de la mise à jour')
});
  }
}

logout(): void {
  this.userService.logout().subscribe({
    next: () => this.destroySession(),
    error: (err) => {
      console.error('Logout error:', err);
      this.destroySession(); // Garantit le nettoyage même si l'API échoue
    }
  });
}

private destroySession(): void {
  // 1. Efface tous les caches
  if (typeof caches !== 'undefined') {
    caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
  }

  // 2. Purge des stockages
  localStorage.clear();
  sessionStorage.clear();
  this.userStore.clearUser();
  
  // 3. Suppression des cookies côté client (si existants)
  document.cookie.split(';').forEach(cookie => {
    document.cookie = cookie.replace(/^ +/, '')
      .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
  });

  // 4. Rupture de session avec rechargement complet
  window.location.href = '/signin';
}
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    console.log('Fichier sélectionné:', this.selectedFile);
  }
}
}
