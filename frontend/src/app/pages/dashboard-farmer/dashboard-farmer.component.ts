import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { FieldLogService } from '../../services/field-log.service';
import { CropService } from '../../services/crop.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard-farmer',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './dashboard-farmer.component.html',
  styleUrls: ['./dashboard-farmer.component.css']
})
export class DashboardFarmerComponent implements OnInit {
  myTasks: any[] = [];
  crops: any[] = []; // To populate the Field Log crop dropdown
  logForm!: FormGroup;
  
  isLoading = true;
  errorMessage = '';
  logSuccessMessage = '';
  logErrorMessage = '';
  isSubmittingLog = false;
  userName: string | null = null;

  constructor(
    private taskService: TaskService, 
    private authService: AuthService,
    private fieldLogService: FieldLogService,
    private cropService: CropService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userName = currentUser ? currentUser.name : 'Farmer';
    
    // Initialize the new Field Log form
    this.logForm = this.fb.group({
      cropId: ['', Validators.required],
      observationType: ['Growth Update', Validators.required],
      notes: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    forkJoin({
      tasks: this.taskService.getMyTasks(),
      crops: this.cropService.getAllCrops() // Fetch all crops for the dropdown
    }).subscribe({
      next: (data) => {
        this.myTasks = data.tasks;
        this.crops = data.crops;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load dashboard data. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  onStatusChange(taskId: string, event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.taskService.updateTaskStatus(taskId, newStatus).subscribe({
      next: () => {
        const task = this.myTasks.find(t => t._id === taskId);
        if (task) { task.status = newStatus; }
      },
      error: (err) => {
        this.errorMessage = 'Failed to update status.';
        this.loadInitialData(); // Revert on failure
      }
    });
  }
  
  // New method to handle Field Log submission
  onLogSubmit(): void {
    this.logForm.markAllAsTouched();
    if (this.logForm.invalid) {
      this.logErrorMessage = "Please fill out all fields to submit a log.";
      return;
    }

    this.isSubmittingLog = true;
    this.logErrorMessage = '';
    this.logSuccessMessage = '';

    this.fieldLogService.createFieldLog(this.logForm.value).subscribe({
      next: () => {
        this.isSubmittingLog = false;
        this.logSuccessMessage = 'Log submitted successfully!';
        this.logForm.reset({ observationType: 'Growth Update' });
      },
      error: (err) => {
        this.isSubmittingLog = false;
        this.logErrorMessage = err.error.message || 'Failed to submit log.';
      }
    });
  }
}