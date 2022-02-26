import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent implements OnInit {
  constructor(private router: Router, public snackBar: MatSnackBar) {}

  ngOnInit() {}

  onSignUp() {
    this.snackBar.open('Success', 'Save', {
      duration: 3000
    });

    this.router.navigate(['/login']);
  }
}
