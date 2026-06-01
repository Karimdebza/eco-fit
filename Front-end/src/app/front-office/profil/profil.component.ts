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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  profileForm!: FormGroup;
  userData!: IUser;
  isEditing = false;
  isLoading = true;
  previewUrl: string | null = null;

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
        this.previewUrl = this.userData.picture || `https://robohash.org/${encodeURIComponent(seed)}?size=200x200`;
        this.initForm(this.userData);
        this.isLoading = false;
      },
      error: () => {
        localStorage.clear();
        this.router.navigate(['/signin']);
      }
    });
  }

  initForm(user: IUser): void {
    this.profileForm = this.fb.group({
      first_name:      [user.first_name, Validators.required],
      last_name:       [user.last_name,  Validators.required],
      email:           [{ value: user.email, disabled: true }],
      number_of_phone: [user.number_of_phone],
      age:             [user.age],
      height:          [user.height],
      size:            [user.size],
      disability_type: [user.disability_type],
      picture:         [user.picture || this.previewUrl]
    });
    this.profileForm.disable();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
      this.profileForm.get('email')?.disable();
    } else {
      this.profileForm.disable();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.profileForm.get('picture')?.setValue(this.previewUrl);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit(): void {
    if (!this.profileForm.valid) return;

    // On ne renvoie jamais password ni token au backend
    const { password, token, ...safeData } = this.userData as any;
    const formValues = this.profileForm.getRawValue();

    const updatedUser: IUser = {
      ...safeData,
      ...formValues,
      picture: this.previewUrl ?? ''
    };

    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        this.userData = updatedUser;
        this.isEditing = false;
        this.profileForm.disable();
        const picture = updatedUser.picture || '';
        localStorage.setItem('user_picture', picture);
        this.userStore.updatePicture(picture);
      },
      error: () => alert('Erreur lors de la mise à jour')
    });
  }

  logout(): void {
    this.userService.logout().subscribe({
      next: () => this.destroySession(),
      error: () => this.destroySession()
    });
  }

  private destroySession(): void {
    if (typeof caches !== 'undefined') {
      caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
    }
    localStorage.clear();
    sessionStorage.clear();
    this.userStore.clearUser();
    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie.replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
    window.location.href = '/signin';
  }
}