import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Subject, switchMap, takeUntil} from "rxjs";
import {User} from "../../../auth/models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {JobsService} from "../../services/jobs.service";
import {AuthServices} from "../../../auth/services/auth.services";
import {UserServices} from "../services/user.services";


@Component({
  selector: 'app-user-reactive-form',
  templateUrl: './user-reactive-form.component.html',
  styleUrls: ['./user-reactive-form.component.scss']
})
export class UserReactiveFormComponent implements OnInit {
  formGroup!: FormGroup;
  user!: User;
  destroy$ = new Subject<boolean>();
  currentUser: User;
  error!: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private jobsService: JobsService,
    private authService: AuthServices,
    private userService: UserServices
  ) {
    this.currentUser = this.authService.getUserFromStorage();
    this.user = {
      email : '',
      fName : '',
      lName: '',
      password: '',
      role: ''
    }

  }


  ngOnInit(): void {
    this.route.params.pipe(switchMap((params) => {
        return this.userService.getUser$(params['id']);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
          this.user = response;
          this.initForm();
      }
    });
  }

  ngOnDestroy(): void{
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit(): void {
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
      this.error = true;
      return;
    }
    const user: User = {
      id: this.currentUser.id,
      email: this.currentUser.email,
      password: this.formGroup.value.password,
      fName: this.formGroup.value.fName,
      lName: this.formGroup.value.lName,
      role: this.currentUser.role
    };


    let request$;
      request$ = this.userService.putUser$(user);


    request$.subscribe({
      next: () => {
        this.authService.storeUserData(user);
        this.router.navigate(['/profile']);
      }
    })
  }

  private initForm(): void{
    this.formGroup = this.fb.group({

      fName: [this.user.fName, [Validators.required, Validators.minLength(5)]],
      lName: [this.user.lName, [Validators.required, Validators.minLength(5)]],

      password: ['', [Validators.required, Validators.minLength(5)]],

    })
  }
}
