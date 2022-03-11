import { Component, OnInit } from '@angular/core';
import {AuthServices} from "../../../auth/services/auth.services";
import {User} from "../../../auth/models/user.model";
import {UserServices} from "../services/user.services";
import {Router} from '@angular/router';
import {JobsService} from "../../services/jobs.service";
import {map} from "rxjs/operators";
import {take} from "rxjs";
import {Job} from "../../models/job.model";


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  currentUser: User;
  cleaned:boolean;
  constructor(
    private router: Router,
    private authService: AuthServices,
    private jobsService: JobsService,
    private userService: UserServices

  ) {
    this.currentUser = authService.getUserFromStorage();
    this.cleaned = false;
  }

  ngOnInit(): void {

  }
  onDelete(): void {
    if (!window.confirm("Do you really want to delete your account?\n " +
      "You will lose it permanently!")) {
        return;
    }

    if(this.currentUser.role === "company"){
      this.jobsService.getJobs$().pipe(
        map((response : Job[]) => {
          return response.filter(job => job.owner.id === this.currentUser.id);


        }),
        take(1)
      ).subscribe({
        next: (response : Job[]) => {

          if(typeof(response) !== 'undefined'){
            for (let i = 0; i < response.length; i++){
              this.jobsService.deleteJob$(response[i].id!).subscribe();
            }
          }
          localStorage.removeItem('loggedUser');
          this.userService.deleteUser$(this.currentUser.id!).subscribe({
            next: () => {
              this.router.navigate(['/auth']);
            }
          });


        }
      })
    }
    else{
      localStorage.removeItem('loggedUser');
      this.userService.deleteUser$(this.currentUser.id!).subscribe({
        next: () => {

          this.router.navigate(['/auth']);
        }
      });
    }


  }

  clearAppliesAndLikes(id:number): void{

    this.jobsService.getJob$(id).pipe(
      map(job => {
        job.candidates = job.candidates!.filter(user => user.id !== this.currentUser.id);
        job.likedBy = job.likedBy!.filter(user => user.id !== this.currentUser.id );
        console.log("basvuru girdi");
        return job;

      }),
      take(1)
    ).subscribe(
      (job) => {
        this.jobsService.putJob$(job).subscribe();

        console.log("basvuru bitis");
      }
    )
  }






}
