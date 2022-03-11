import {Component, Input,EventEmitter, Output} from '@angular/core';
import {Job} from "../../models/job.model";
import {JobsService} from "../../services/jobs.service";
import {AuthServices} from "../../../auth/services/auth.services";
import {User} from "../../../auth/models/user.model";
import { take,map} from "rxjs";

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss']
})
export class JobItemComponent  {
  @Input() job!: Job;
  currentUser: User;

  @Output() jobDeleted: EventEmitter<number> = new EventEmitter<number>();
  constructor( private jobsService: JobsService,
               private authService: AuthServices,
                ) {
    this.currentUser = this.authService.getUserFromStorage();
  }

  onLike(): void {
    if(undefined === this.job.likedBy){
      this.job.likedBy = [this.currentUser]
    }
    else{
      this.job.likedBy.push(this.currentUser);
    }
    this.jobsService.putJob$(this.job).subscribe();
  }

  onDislike():void{
    this.jobsService.getJob$(this.job.id!).pipe(
      map(job => {
        job.likedBy = job.likedBy!.filter(user => user.id !== this.currentUser.id );
        return job;
      }),
      take(1)
    ).subscribe(
      (job) => {
        this.jobsService.putJob$(job).subscribe();
        this.job = job;
      }
    )
  }

  onDelete(): void{
    this.jobDeleted.emit(this.job.id);
  }

  onApply(): void{
    if(undefined === this.job.candidates){
      this.job.candidates = [this.currentUser]
    }
    else{
      this.job.candidates.push(this.currentUser);
    }
    this.jobsService.putJob$(this.job).subscribe();
  }

  onUnApply(): void{
    this.jobsService.getJob$(this.job.id!).pipe(
      map(job => {
        job.candidates = job.candidates!.filter(user => user.id !== this.currentUser.id );
        return job;
      }),
      take(1)
    ).subscribe(
      (job) => {
        this.jobsService.putJob$(job).subscribe();
        this.job = job;
      }
    )
  }

  notCompany(): boolean {
    return this.currentUser.role !== 'company'
  }

  alreadyApplied(): boolean{
    return this.job.candidates?.find(candidates => candidates.id === this.currentUser.id) ? true : false;
  }

  alreadyLiked(): boolean{
    return this.job.likedBy?.find(likedBy => likedBy.id === this.currentUser.id) ? true : false;
  }

  jobOwner(): boolean{
    return this.job.owner.id === this.currentUser.id;
  }

  likeCount(): number{
    let len = this.job.likedBy?.length;
    if(len){
      return len;
    }
    return 0;
  }

  candidateCount(): number{
    let len = this.job.candidates?.length;
    if(len){
      return len
    }
    return 0;
  }

  accepted(): boolean{
    return this.job.acceptedCandidate?.id === this.currentUser.id;
  }
}
