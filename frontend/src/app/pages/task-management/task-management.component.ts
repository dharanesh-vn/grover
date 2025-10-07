import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { CropService } from '../../services/crop.service';
import { UserService } from '../../services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  providers: [DatePipe],
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.css']
})
export class TaskManagementComponent implements OnInit {
  taskForm!: FormGroup;
  tasks: any[] = [];
  users: any[] = []; // To populate the 'Assigned To' dropdown
  crops: any[] = []; // To populate the 'Related Crop' dropdown

  isFormVisible = false;
  isEditing = false;
  currentTaskId: string | null = null;
  
  isLoading = true;
  isSubmitting = false;
  
  generalErrorMessage = '';
  formErrorMessage = '';

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private cropService: CropService,
    private userService: UserService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      taskDescription: ['', Validators.required],
      assignedTo: ['', Validators.required],
      cropId: ['', Validators.required],
      status: ['Pending', Validators.required],
      dueDate: ['', Validators.required]
    });

    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.generalErrorMessage = '';

    // Use forkJoin to fetch all necessary data in parallel
    forkJoin({
      tasks: this.taskService.getAllTasks(),
      users: this.userService.getUsers(),
      crops: this.cropService.getAllCrops()
    }).subscribe({
      next: (data) => {
        this.tasks = data.tasks;
        this.users = data.users;
        this.crops = data.crops;
        this.isLoading = false;
      },
      error: (err) => {
        this.generalErrorMessage = 'Failed to load page data. You may not have permission.';
        this.isLoading = false;
      }
    });
  }

  showCreateForm(): void {
    this.isEditing = false;
    this.isFormVisible = true;
    this.formErrorMessage = '';
    this.currentTaskId = null;
    this.taskForm.reset({ status: 'Pending' }); // Reset form with default status
  }

  showEditForm(task: any): void {
    this.isEditing = true;
    this.isFormVisible = true;
    this.formErrorMessage = '';
    this.currentTaskId = task._id;
    this.taskForm.setValue({
      taskDescription: task.taskDescription,
      assignedTo: task.assignedTo._id, // Set the ID for the dropdown
      cropId: task.cropId._id,         // Set the ID for the dropdown
      status: task.status,
      dueDate: this.datePipe.transform(task.dueDate, 'yyyy-MM-dd')
    });
  }

  hideForm(): void {
    this.isFormVisible = false;
  }

  onSubmit(): void {
    this.taskForm.markAllAsTouched();
    if (this.taskForm.invalid) {
      this.formErrorMessage = 'Please fill out all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.formErrorMessage = '';

    const operation = this.isEditing && this.currentTaskId
      ? this.taskService.updateTask(this.currentTaskId, this.taskForm.value)
      : this.taskService.createTask(this.taskForm.value);

    operation.subscribe({
      next: () => {
        this.loadInitialData(); // Reload all data
        this.hideForm();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.formErrorMessage = err.error.message || 'An unexpected error occurred.';
        this.isSubmitting = false;
      }
    });
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.generalErrorMessage = '';
      this.taskService.deleteTask(id).subscribe({
        next: () => { this.loadInitialData(); }, // Reload all data
        error: (err) => { this.generalErrorMessage = err.error.message || 'Failed to delete task.'; }
      });
    }
  }
}