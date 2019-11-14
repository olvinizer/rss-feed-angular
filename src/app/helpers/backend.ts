import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, dematerialize, materialize, mergeMap} from 'rxjs/operators';
import {User} from '../models/user';
import {LocalStorageService} from '../services/local-storage.service';


const users: User[] = [{email: 'nik@firmas.lv', username: 'test', password: 'test123'}];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor(private ls: LocalStorageService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, headers, body} = request;
    const ls = this.ls;

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      let func = null;
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          func = authenticate;
          break;
        case url.endsWith('/users/register') && method === 'POST':
          func = register;
          break;
        case url.endsWith('/users/exists') && method === 'POST':
          func = exists;
          break;
        case url.endsWith('/feed'):
          func = feed;
          break;
      }
      if (func) {
        if (ls.isAvailable()) {
          return <Observable<HttpEvent<any>>>func.call();
        } else {
          return error('Local Storage is not available for your browser. Testing is impossible');
        }
      }
      return next.handle(request);
    }

    // route functions
    function authenticate() {
      const {email, password} = body;
      const user = getUser(email);
      if (!user || user.password !== password) {
        return error('Email or password is incorrect');
      }
      return ok(user);
    }

    function register() {
      const {email, password} = body;
      if (getUser(email)) {
        return error('User is already exists');
      }
      const user = new User({email, password});
      ls.setItem(user.email, JSON.stringify(user));
      return ok(user);
    }

    function exists() {
      const {email} = body;
      const user = getUser(email);
      return ok(user ? true : false);
    }

    function feed() {
      const dupReq = request.clone({url: '/assets/feed.xml'});
      return next.handle(dupReq);
    }

    // helper functions
    function ok(response) {
      return of(new HttpResponse({status: 200, body: response}));
    }

    function error(message) {
      return throwError({error: {message}});
    }

    function getUser(id) {
      const json = ls.getItem(id);
      return json ? JSON.parse(json) : null;
    }
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
