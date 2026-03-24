import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterLink ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) { return; }
    this.errorMessage = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.authService.storeUserData(response.token, response.user);
        
        const user = response.user;
        if (user.role === 'Admin') {
          this.router.navigate(['/app/dashboard-admin']);
        } else if (user.role === 'Agronomist') {
          this.router.navigate(['/app/dashboard-agronomist']);
        } else if (user.role === 'Operator') {
          this.router.navigate(['/app/dashboard-operator']);
        } else {
          this.router.navigate(['/app/weather']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}