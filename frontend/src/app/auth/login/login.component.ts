import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private destroy$ = new Subject();
  loader: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initializeForm();
  }
  initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.loader = true;
    this.authService
      .login(this.loginForm.value)
      .subscribe(
        (response) => {
          localStorage.setItem('user', JSON.stringify(response));
          this.router.navigate(['/dashboard']);
          this.loader = false;
        },
        (error) => {
          this.loader = false;
          this.snackBar.open(error.message, 'Ok', {
            duration: 3000
          });

        }
      );
  }
}
