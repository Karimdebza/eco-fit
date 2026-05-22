import { Routes } from '@angular/router';
import { FrontOfficeComponent } from './front-office/front-office.component';
import { SignupComponent } from './front-office/signup/signup.component';
import { CategoriesComponent } from './front-office/categories/categories.component';
import { ProfilComponent } from './front-office/profil/profil.component';
import { SigninComponent } from './front-office/signin/signin.component';
import { ExerciseComponent } from './front-office/exercise/exercise.component';
import { FoodListComponent } from './front-office/food-list/food-list.component';
import { FoodDetailComponent } from './front-office/food-list/food-detail/food-detail.component';
import { ExerciseDetailComponent } from './front-office/exercise/exercise-detail/exercise-detail.component';
import { AboutUsComponent } from './front-office/about-us/about-us.component';
import { PartnerComponent } from './front-office/partner/partner.component';
import { SubscreptionComponent } from './front-office/subscreption/subscreption.component';
import { HomeComponent } from '../app/front-office/home/home.component';
import { EventDetailComponent } from './front-office/event/event-detail/event-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { EventListComponent } from './front-office/event/event-list/event-list.component';
import { EventFormComponent } from './front-office/event/event-form/event-form.component';
import { TrackerComponent } from './front-office/tracker/tracker.component';

export const routes: Routes = [
  {
    path: '',
    component: FrontOfficeComponent,
    children: [
      { path: '', component: HomeComponent }, // page d'accueil
      { path: 'categories', component: CategoriesComponent,  }, // page des catégories
      { path: 'profil', component: ProfilComponent , }, // page de profil
      { path: 'signup', component: SignupComponent },
      { path: 'signin', component: SigninComponent },
      { path: 'tracker', component: TrackerComponent, canActivate: [AuthGuard] },
      { path: 'exercises', component: ExerciseComponent,  }, // page des exercices
      { path: 'exercise/:id', component: ExerciseDetailComponent,  }, // page de détail d'un exercice
      { path: 'alimentation', component: FoodListComponent,  }, // page de liste des aliments
      { path: 'alimentation/:id', component: FoodDetailComponent, }, // page de détail d'un aliment
      { path: 'about-us', component: AboutUsComponent }, // page "À propos de nous"
      { path: 'event', component: EventListComponent,  },
      { path: 'event/new', component: EventFormComponent,  },
      { path: 'event/edit/:id', component: EventFormComponent,  },
      { path: 'event/:id', component: EventDetailComponent,  },
      { path: 'partner', component: PartnerComponent,  }, // page des partenaires
      { path: 'subscreption', component: SubscreptionComponent, canActivate: [AuthGuard] }, // page des abonnements
      {path: 'event/:id', component: EventDetailComponent, canActivate: [AuthGuard] }, // page de détail d'un événement
    ]
  },
  // fallback
  { path: '**', redirectTo: '' }
];
