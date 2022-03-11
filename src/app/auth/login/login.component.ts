import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthServices} from "../services/auth.services";
import {User} from "../models/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup!: FormGroup;
  loginFailed: boolean = false;
  constructor(
      private fb: FormBuilder,
      private router: Router,
      private authService: AuthServices
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      email: ['',[Validators.required, Validators.min(3)] ],
      password: ['', [Validators.required, Validators.min(3)]]
    })
  }

  onSubmit(): void{
    // 1.login request
    this.authService.login$(this.formGroup.value).subscribe({
      next: (response:User) => {
        if(response){
          // 2. store data, local-storage
          this.authService.storeUserData(response);

          // 3. navigate inside system
          this.router.navigate(['/']);
        }
        else{
          this.loginFailed = true;
        }
      }
    })
  }
  get emailFormControl(): FormControl {
    return this.formGroup?.get('email') as FormControl;
  }
  get passwordFormControl(): FormControl {
    return this.formGroup?.get('password') as FormControl;
  }

}
