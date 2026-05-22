import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { IUserSignup } from '../../models/IFormUser';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup<{
    last_name:       FormControl<string>;
    first_name:      FormControl<string>;
    email:           FormControl<string>;
    password:        FormControl<string>;
    number_of_phone: FormControl<string>;
    size:            FormControl<number>;
    height:          FormControl<number>;
    age:             FormControl<number>;
    disability_type: FormControl<string>; // fix: était disabilty_status
  }>;

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: NonNullableFormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      last_name:       ['', [Validators.required]],
      first_name:      ['', [Validators.required]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      number_of_phone: ['', [Validators.required]],
      size:            [0,  [Validators.required, Validators.min(1)]],
      height:          [0,  [Validators.required, Validators.min(1)]],
      age:             [0,  [Validators.required, Validators.min(1)]],
      disability_type: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    // Fix: isSubmitting ne se déclenche que si le form est valide
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched(); // force l'affichage des erreurs
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload: IUserSignup = this.signupForm.getRawValue();

    this.userService.signup(payload).subscribe({
      next: () => {
        this.successMessage = 'Compte créé ! Redirection...';
        setTimeout(() => this.router.navigate(['/front-office/signin']), 1500);
      },
      error: (err) => {
        // Fix: feedback visible pour l'utilisateur
        this.errorMessage = err.error?.message ?? 'Une erreur est survenue. Réessayez.';
        this.isSubmitting = false;
      }
    });
  }
}