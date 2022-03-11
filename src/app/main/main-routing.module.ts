import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {MainComponent} from "./main.component";
import {CompanyGuard} from "../guards/company.guard";
import {JobsComponent} from "./jobs/jobs/jobs.component";
import {JobReactiveFormComponent} from "./jobs/job-reactive-form/job-reactive-form.component";
import {UserProfileComponent} from "./user/user-profile/user-profile.component";
import {UserReactiveFormComponent} from "./user/user-reactive-form/user-reactive-form.component";
import {JobCandidatesComponent} from "./jobs/job-candidates/job-candidates.component";


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'jobs'
      },
      {
        path: 'jobs',
        component: JobsComponent
      },
      {
        path: 'jobs/create',
        component: JobReactiveFormComponent,
        canActivate: [CompanyGuard]
      },
      {
        path: 'jobs/edit/:id',
        component: JobReactiveFormComponent,
        canActivate: [CompanyGuard]

      },
      {
        path: 'profile',
        component: UserProfileComponent
      },
      {
        path: 'profile/edit/:id',
        component: UserReactiveFormComponent
      },
      {
        path: 'candidates',
        component: JobCandidatesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule{

}
