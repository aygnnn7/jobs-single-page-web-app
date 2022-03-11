import {CanLoad, Route, Router, UrlSegment} from "@angular/router";
import {Injectable} from "@angular/core";
import {AuthServices} from "../auth/services/auth.services";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad{
  constructor(
    private authService: AuthServices,
    private router: Router
  ) {
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    const loggedUser = this.authService.getUserFromStorage();
    if(!loggedUser){
      this.router.navigate(['/auth']);
      return false;
    }
    return true;


  }
}
