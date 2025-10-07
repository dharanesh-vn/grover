import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  weatherForm: FormGroup;
  weatherData: any = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private weatherService: WeatherService) {
    this.weatherForm = this.fb.group({
      city: ['London', Validators.required] // Default city
    });
  }

  getWeather() {
    if (this.weatherForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.weatherData = null;
    this.errorMessage = '';
    const city = this.weatherForm.value.city;

    this.weatherService.getWeather(city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'An error occurred.';
        this.isLoading = false;
      }
    });
  }
}