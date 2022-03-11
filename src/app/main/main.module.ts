import {NgModule} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MainRoutingModule} from "./main-routing.module";
import {MainComponent} from "./main.component";
import { JobsComponent } from './jobs/jobs/jobs.component';
import { JobItemComponent } from './jobs/job-item/job-item.component';
import { JobReactiveFormComponent } from './jobs/job-reactive-form/job-reactive-form.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import {UserReactiveFormComponent} from "./user/user-reactive-form/user-reactive-form.component";
import {JobCandidatesComponent} from "./jobs/job-candidates/job-candidates.component";
import {JobCandidateComponent} from "./jobs/job-candidate/job-candidate.component";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MainRoutingModule
  ],
  declarations: [
    MainComponent,
    JobsComponent,
    JobItemComponent,
    JobReactiveFormComponent,
    UserProfileComponent,
    UserReactiveFormComponent,
    JobCandidatesComponent,
    JobCandidateComponent
  ]
})


export class MainModule{
}
