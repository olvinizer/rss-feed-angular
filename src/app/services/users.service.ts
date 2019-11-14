import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {switchMap} from 'rxjs/operators';
import {AuthenticationService} from './authentification.service';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private authentificationService: AuthenticationService) {
  }

  exists(email: string) {
    return this.http.post<boolean>(`${environment.api}/users/exists`, {email});
  }

  register(email: string, password: string) {
    return this.http.post<User>(`${environment.api}/users/register`, {email, password})
      .pipe(switchMap(user => this.authentificationService.login(user.email, user.password)));
  }
}
