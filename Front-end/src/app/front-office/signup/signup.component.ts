import { Component,OnInit } from '@angular/core';
import {  FormGroup, Validators, FormControl,NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

import { IUserSignup } from '../../models/IFormUser';
import { NgIf } from '@angular/common';



@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {


    signupForm!: FormGroup<{
    last_name: FormControl<string>;
    first_name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    number_of_phone: FormControl<string>;
    size: FormControl<number>;
    height: FormControl<number>;
    age: FormControl<number>;
    picture: FormControl<string>;
    disabilty_status: FormControl<string>;
  }>;
    isSubmitting = false; 

  constructor(private fb: NonNullableFormBuilder, private userService: UserService, private router: Router) {
    
}
 ngOnInit(): void {
    // NonNullableFormBuilder garantit que chaque contrôle est non-nullable
    this.signupForm = this.fb.group({
      last_name:        ['', { validators: [Validators.required], nonNullable: true }],
      first_name:       ['', { validators: [Validators.required], nonNullable: true }],
      email:            ['', { validators: [Validators.required, Validators.email], nonNullable: true }],
      password:         ['', { validators: [Validators.required, Validators.minLength(8)], nonNullable: true }],
      number_of_phone:  ['', { validators: [Validators.required], nonNullable: true }],
      size:             [0,  { validators: [Validators.required], nonNullable: true }],
      height:           [0,  { validators: [Validators.required], nonNullable: true }],
      age:              [0,  { validators: [Validators.required], nonNullable: true }],
      picture:          ['', { validators: [Validators.required], nonNullable: true }],
      disabilty_status: ['', { validators: [Validators.required], nonNullable: true }],
    });
  }

  onSubmit(): void {
  if (this.signupForm.valid) {
    const newUser: IUserSignup = this.signupForm.getRawValue();
    this.userService.signup(newUser).subscribe({
      next: data  => {
        console.log('Signup successful:', data);
        this.router.navigate(['/front-office']);
      },
      error: err => console.error('Signup error', err)
    });
  }
   this.isSubmitting = true;

}

}