import { Component, OnInit } from '@angular/core';
import {Job} from "../../models/job.model";
import {JobsService} from "../../services/jobs.service";
import {AuthServices} from "../../../auth/services/auth.services";
import {take} from "rxjs";
import {map} from "rxjs/operators";
import {User} from "../../../auth/models/user.model";

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  jobs!: Job[];
  onlyAppliedJobs: boolean;
  candidatedJobs!: Job[];
  currentUser: User;


  constructor(private jobsService: JobsService,
              private authService: AuthServices)
  {
    this.currentUser = this.authService.getUserFromStorage();
    this.onlyAppliedJobs = false;
    this.getCandidatedJobs()



  }

  ngOnInit(): void {
    this.getContent();
  }

  onAppliedOrNot(): void{
    this.onlyAppliedJobs = !this.onlyAppliedJobs;
    if(this.onlyAppliedJobs)  this.getCandidatedJobs();
    this.getContent()
  }

  onJobDelete(jobId: number): void{
    if(!window.confirm("Are you sure that you want to delete the job?")){
      return;
    }
    this.jobsService.deleteJob$(jobId).subscribe({
      next: () => {
        this.jobs = this.jobs.filter(j => j.id !== jobId);
      }
    });
  }


  getCandidatedJobs(): void{
    this.jobsService.getJobs$().pipe(
      map((response:Job[]) => {

        return response.filter(job => job.candidates?.find(user => user.id === this.currentUser.id)
                                                || job.acceptedCandidate?.id === this.currentUser.id);

      }),
     take(1)
    ).subscribe({
      next: (response : Job[]) => {
        this.candidatedJobs = response;

      }
    })
  }

  getContent(): void {

    this.jobsService.getJobs$().pipe(
      map((response:Job[]) => {
        const sortedResponse = response.sort((a, b) => {
          if(a.title < b.title) {
            return -1;
          }
          if(a.title > b.title){
            return 1;
          }
          return 0;
        });

        return sortedResponse;
      }),
      take(1)
    ).subscribe({
      next: (response :Job[]) => {
        this.jobs = response;

      }
    });
  }

  notCompany(): boolean {
    return this.currentUser.role !== 'company'
  }




}
