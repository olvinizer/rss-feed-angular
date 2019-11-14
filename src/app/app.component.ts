import {Component} from '@angular/core';
import {AuthenticationService} from './services/authentification.service';
import {Router} from '@angular/router';
import {User} from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular';
  user: User;

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(user => this.user = user);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    return false;
  }
}
