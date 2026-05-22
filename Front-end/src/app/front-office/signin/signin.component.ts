import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'] // <-- corrigé ici
})
export class SigninComponent {

  signinForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signinForm.valid) {
      this.userService.login(this.signinForm.value).subscribe({
        next: (data: any) => {
          console.log('Réponse backend complète:', data);

          const user = data.user;
          if (!user) {
            this.errorMessage = 'Utilisateur manquant dans la réponse';
            return;
          }

          const userId = user.id ?? user.id_user;
          if (!userId) {
            this.errorMessage = 'ID utilisateur manquant dans la réponse';
            return;
          }

          localStorage.setItem('token', data.token);
          localStorage.setItem('user_id', userId.toString());
          localStorage.setItem('user_email', user.email);

          this.router.navigate(['/profil']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Email ou mot de passe incorrect';
        }
      });
    }
  }
}
