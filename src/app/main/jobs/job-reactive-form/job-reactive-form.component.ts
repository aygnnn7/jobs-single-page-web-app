import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Job} from "../../models/job.model";
import {of, Subject, switchMap, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {JobsService} from "../../services/jobs.service";
import {User} from "../../../auth/models/user.model";
import {AuthServices} from "../../../auth/services/auth.services";

@Component({
  selector: 'app-job-reactive-form',
  templateUrl: './job-reactive-form.component.html',
  styleUrls: ['./job-reactive-form.component.scss']
})
export class JobReactiveFormComponent implements OnInit {

  formGroup!: FormGroup;
  job!: Job;
  destroy$ = new Subject<boolean>();
  currentUser: User;
  error!: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private jobsService: JobsService,
    private authService: AuthServices
  ) {
    this.currentUser = this.authService.getUserFromStorage();
    this.job = {
      title: '',
      description: '',
      type: '',
      category: '',
      active: true,
      owner: this.currentUser

    }

  }

  get titleFormControl(): FormControl {
    return this.formGroup?.get('title') as FormControl;
  }
  get descFormControl(): FormControl {
    return this.formGroup?.get('description') as FormControl;
  }
  get typeFormControl(): FormControl {
    return this.formGroup?.get('type') as FormControl;
  }
  get categoryFormControl(): FormControl {
    return this.formGroup?.get('category') as FormControl;
  }



  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params) => {
        if(params['id']){
          return this.jobsService.getJob$(params['id']);
        }
        this.initForm();
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        if(response) {
          this.job = response;
          this.initForm();
        }
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
    const job: Job = {
      id: this.formGroup.value.id,
      title: this.formGroup.value.title,
      description: this.formGroup.value.description,
      type: this.formGroup.value.type,
      category: this.formGroup.value.category,
      active: true,
      owner: this.currentUser
    };

    let request$;

    if(job.id){
      request$ = this.jobsService.putJob$(job);
    } else {
      request$ = this.jobsService.postJob$(job);
    }

    request$.subscribe({
      next: () => {
        this.router.navigate(['/jobs']);
      }
    })
  }

  private initForm(): void{
    this.formGroup = this.fb.group({
      title: [this.job.title, [Validators.required, Validators.minLength(5)]],
      description:[ this.job.description, [Validators.required, Validators.minLength(15)]],
      type: [this.job.type, [Validators.required, Validators.minLength(5)]],
      category: [this.job.category, [Validators.required, Validators.minLength(5)]],
    })
  }

}
