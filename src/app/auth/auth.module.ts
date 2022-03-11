import {NgModule} from "@angular/core";
import {LoginComponent} from "./login/login.component";
import {AuthComponent} from "./auth/auth.component";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

import {AuthRoutingModule} from "./auth-routing.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthRoutingModule
  ],
  declarations: [
    LoginComponent,
    AuthComponent
  ]
})

export class AuthModule{
}

