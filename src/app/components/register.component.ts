import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../services/authentification.service';
import {catchError, debounceTime, first, map} from 'rxjs/operators';
import {UsersService} from '../services/users.service';
import {combineLatest, Observable, throwError} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {
  public ui = {
    submitted: false,
    processing: false,
    error: null,
    returnUrl: null
  };
  registerForm: FormGroup;

  get form() {
    return this.registerForm.controls;
  }

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authenticationService: AuthenticationService,
              private usersService: UsersService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email], this.checkEmail.bind(this)],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.ui.submitted = true;

    if (this.registerForm.invalid) {
      return false;
    }

    this.ui.processing = true;
    this.usersService.register(this.form.email.value, this.form.password.value)
      .pipe(first())
      .subscribe(data => this.router.navigate(['/']),
        error => {
          this.ui.error = error.error;
          this.ui.processing = false;
        });
  }

  checkEmail({value}: AbstractControl): Observable<ValidationErrors | null> {
    const validations: Observable<boolean>[] = [];
    validations.push(this.usersService.exists(value));
    return combineLatest(validations)
      .pipe(debounceTime(500),
        catchError(e => {
          this.ui.error = e.error;
          return throwError(e);
        }),
        map(([isTaken]) => {
          if (isTaken) {
            return {
              isTaken: true
            };
          }
          return null;
        }));
  }
}
