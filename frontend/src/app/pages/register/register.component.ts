import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../../validators/custom-validators'; // Import our new validators

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Add the new phone format validator
      phone: ['', [Validators.required, CustomValidators.phoneFormat()]],
      // Add the new password strength validator
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.passwordStrength()
      ]],
      role: ['Farmer', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = "Please correct the errors before submitting.";
      return;
    }
    
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! You will be redirected to the login page.';
        this.registerForm.reset();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Registration failed. Please try again.';
      }
    });
  }
}