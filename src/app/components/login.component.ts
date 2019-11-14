import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/authentification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  public ui = {
    submitted: false,
    processing: false,
    error: null,
    returnUrl: null
  };
  loginForm: FormGroup;

  get form() {
    return this.loginForm.controls;
  }

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authenticationService: AuthenticationService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // get return url from route parameters or default to '/'
    this.ui.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    this.ui.submitted = true;

    if (this.loginForm.invalid) {
      return false;
    }

    this.ui.processing = true;
    this.authenticationService.login(this.form.email.value, this.form.password.value)
      .pipe(first())
      .subscribe(data => this.router.navigate([this.ui.returnUrl]),
        error => {
          this.ui.error = error.error;
          this.ui.processing = false;
        });
  }
}
