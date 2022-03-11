import { Component } from '@angular/core';
import {AuthServices} from "../auth/services/auth.services";
import {Router} from "@angular/router";
import {User} from "../auth/models/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  currentUser: User;
  constructor(
    private authService : AuthServices,
    private router: Router
  ) {
    this.currentUser = this.authService.getUserFromStorage();
  }

  onLogout(): void{
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  isLogged(): boolean{
    if(this.authService.getUserFromStorage()) return true;

    return false;
  }

  notCompany(): boolean {
    if(typeof(this.currentUser.role!) === 'undefined')
      console.log("check role problem");
      return this.currentUser.role! !== 'company';

  }


}
