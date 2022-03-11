import {Component, Input,EventEmitter, Output} from '@angular/core';
import {Job} from "../../models/job.model";
import {JobsService} from "../../services/jobs.service";
import {AuthServices} from "../../../auth/services/auth.services";
import {User} from "../../../auth/models/user.model";


@Component({
  selector: 'app-job-candidate',
  templateUrl: './job-candidate.component.html',
  styleUrls: ['./job-candidate.component.scss']
})
export class JobCandidateComponent {

  @Input() job!: Job;
  @Input() candidates!: User[];
  currentUser: User;
  @Output() jobDeleted: EventEmitter<number> = new EventEmitter<number>();
  constructor(
    private jobsService: JobsService,
    private authService: AuthServices
  ) {
    this.currentUser = this.authService.getUserFromStorage();

  }

  onDelete(): void{
    if (window.confirm("Do you really want to deny the employee?"))
                                    this.jobDeleted.emit(this.job.id);
  }
  jobOwner(): boolean{
    return this.job.owner.id === this.currentUser.id;
  }
  accept(candidate: User){
    if (window.confirm("Do you really want to accept the employee?\n" +
      "The other candidates will be automatically denied!")) {
      this.job.acceptedCandidate = candidate;
      this.job.candidates = undefined;
      this.jobsService.putJob$(this.job).subscribe();
    }

  }

  deny(){
    if (window.confirm("Do you really want to deny the employee?")) {
      this.job.acceptedCandidate = undefined;
      this.jobsService.putJob$(this.job).subscribe();
    }
  }

  candidateCount(): number{
    let len = this.job.candidates?.length;
    if(len){
      return len
    }
    return 0;
  }

  likeCount(): number{
    let len = this.job.likedBy?.length;
    if(len){
      return len;
    }
    return 0;
  }

  isEmployeeAccepted():boolean{
    return  typeof(this.job.acceptedCandidate) !== 'undefined';
  }



}
