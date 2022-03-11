import { Component, OnInit } from '@angular/core';
import {Job} from "../../models/job.model";
import {JobsService} from "../../services/jobs.service";
import {AuthServices} from "../../../auth/services/auth.services";
import {take} from "rxjs";
import {map} from "rxjs/operators";
import {User} from "../../../auth/models/user.model";

@Component({
  selector: 'app-job-candidates',
  templateUrl: './job-candidates.component.html',
  styleUrls: ['./job-candidates.component.scss']
})
export class JobCandidatesComponent implements OnInit {

  jobs!: Job[];
  currentUser: User;
  constructor(
        private jobsService: JobsService,
        private authService: AuthServices
  ) {
    this.currentUser = this.authService.getUserFromStorage();
  }

  ngOnInit(): void {
    this.getContent();
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

  onJobDelete(jobId: number): void{
    this.jobsService.deleteJob$(jobId).subscribe({
      next: () => {
        this.jobs = this.jobs.filter(j => j.id !== jobId);
      }
    });
  }

  notCompany(): boolean {
    return this.currentUser.role !== 'company'
  }

}
