import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, CanActivateChild } from '@angular/router';
import { AuthService } from 'app/feature/auth/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.getEmployeeAuthorities().pipe(
      map(userInfo => {
        if (!userInfo || userInfo.employeeId === 0) {
          return false;
        } else {
          return true;
        }
      }),
      catchError((err) => {
        this.router.navigateByUrl(`auth/login`);
        return of(false);
      })
    );
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.getEmployeeAuthorities().pipe(
      map(userInfo => {
        if (!userInfo || userInfo.employeeId === 0) {
          return false;
        } else {
          return true;
        }
      }),
      catchError((err) => {
        this.router.navigateByUrl(`auth/login`);
        return of(false);
      })
    );
  }
}