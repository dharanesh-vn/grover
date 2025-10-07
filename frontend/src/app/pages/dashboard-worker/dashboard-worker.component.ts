import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-worker',
  standalone: true,
  imports: [CommonModule, DatePipe],
  providers: [DatePipe],
  templateUrl: './dashboard-worker.component.html',
  styleUrls: ['./dashboard-worker.component.css']
})
export class DashboardWorkerComponent implements OnInit {
  myTasks: any[] = [];
  isLoading = true;
  errorMessage = '';
  userName: string | null = null;

  constructor(private taskService: TaskService, private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userName = currentUser ? currentUser.name : 'Worker';
    this.loadMyTasks();
  }

  loadMyTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.taskService.getMyTasks().subscribe({
      next: (data) => {
        // For workers, we only show pending or in-progress tasks
        this.myTasks = data.filter(task => task.status !== 'Completed');
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load your tasks. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  // Simple function to mark a task as completed
  markAsCompleted(taskId: string): void {
    this.taskService.updateTaskStatus(taskId, 'Completed').subscribe({
      next: () => {
        // Remove the task from the view once it's completed
        this.myTasks = this.myTasks.filter(task => task._id !== taskId);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update task. Please try again.';
      }
    });
  }
}