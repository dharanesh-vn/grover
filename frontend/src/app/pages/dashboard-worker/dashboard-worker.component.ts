import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-worker',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './dashboard-worker.component.html',
  styleUrls: ['./dashboard-worker.component.css']
})
export class DashboardWorkerComponent implements OnInit {
  myTasks: any[] = [];
  isLoading = true;
  errorMessage = '';
  userName: string | null = null;
  
  isNoteModalVisible = false;
  taskToComplete: any = null;
  completionForm!: FormGroup;

  constructor(
    private taskService: TaskService, 
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userName = currentUser ? currentUser.name : 'Worker';

    this.completionForm = this.fb.group({
      completionNote: ['']
    });

    this.loadMyTasks();
  }

  loadMyTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.taskService.getMyTasks().subscribe({
      next: (data) => {
        this.myTasks = data.filter(task => task.status !== 'Completed');
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load your tasks. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  startTask(taskId: string): void {
    const task = this.myTasks.find(t => t._id === taskId);
    if (task && task.status === 'Pending') {
      this.taskService.updateTaskStatus(taskId, 'In Progress').subscribe({
        next: () => {
          task.status = 'In Progress';
        },
        error: (err) => { this.errorMessage = 'Failed to start task.'; }
      });
    }
  }

  openCompletionModal(task: any): void {
    this.taskToComplete = task;
    this.isNoteModalVisible = true;
    this.completionForm.reset();
  }
  
  closeCompletionModal(): void {
    this.isNoteModalVisible = false;
    this.taskToComplete = null;
  }
  
  submitCompletion(): void {
    if (!this.taskToComplete) return;

    const note = this.completionForm.value.completionNote || '';

    // This function now correctly calls the fixed service method
    this.taskService.completeTaskWithNote(this.taskToComplete._id, note).subscribe({
      next: () => {
        this.myTasks = this.myTasks.filter(task => task._id !== this.taskToComplete._id);
        this.closeCompletionModal();
      },
      error: (err) => {
        this.errorMessage = 'Failed to complete task. Please try again.';
        this.closeCompletionModal();
      }
    });
  }
}