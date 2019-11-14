import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login.component';
import {FeedComponent} from './components/feed.component';
import {AuthGuard} from './helpers/auth-guard';
import {RegisterComponent} from './components/register.component';

const routes: Routes = [
  {path: '', component: FeedComponent, canActivate: [AuthGuard]},
  {path: 'feed/:page', component: FeedComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
