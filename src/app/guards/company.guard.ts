import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthServices} from "../auth/services/auth.services";


@Injectable({
  providedIn: 'root'
})
export class CompanyGuard implements CanActivate{
  constructor(
    private authService: AuthServices,
    private router: Router
  ) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const loggedUser = this.authService.getUserFromStorage();

    if(loggedUser.role !== 'company'){
      this.router.navigate(['/']);

      return false;
    }

    return true;
  }
}
