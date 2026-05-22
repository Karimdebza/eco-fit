import { Injectable } from '@angular/core';
import { CanActivate, Router,  } from '@angular/router';

import { UserService } from '../services/user.service';
import { Observable ,  of} from 'rxjs';

import { map, catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.checkToken().pipe(
      map(isAuth => {
        if (isAuth) {
          return true;
        } else {
          this.router.navigate(['/signin']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/signin']);
        return of(false);
      })
    );
  }
}
