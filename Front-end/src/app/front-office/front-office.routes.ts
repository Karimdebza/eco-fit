import { Routes } from '@angular/router';
import { FrontOfficeComponent } from './front-office.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ProfilComponent } from './profil/profil.component';



export const FRONT_OFFICE_ROUTES: Routes = [
  {
    path: 'front-office',
    component: FrontOfficeComponent,
    children: [
      {path: '/signup', component: SignupComponent},
      {path: 'signin', component: SigninComponent},
      {path: 'profil', component: ProfilComponent}, 
    ]
  }
];

