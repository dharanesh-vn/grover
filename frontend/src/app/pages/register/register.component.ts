import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterLink ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, CustomValidators.lettersOnly()]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, CustomValidators.phoneFormat()]],
      password: ['', [Validators.required, Validators.minLength(8), CustomValidators.passwordStrength()]],
      role: ['Farmer', Validators.required]
    });
  }

  onSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) {
      this.errorMessage = "Please correct all errors before submitting.";
      return;
    }
    
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        this.isSubmitting = false;
        setTimeout(() => { this.router.navigate(['/login']); }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Registration failed. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}