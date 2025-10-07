import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
@Component({
selector: 'app-dashboard-farmer',
standalone: true,
imports: [CommonModule, DatePipe],
providers: [DatePipe],
templateUrl: './dashboard-farmer.component.html',
styleUrls: ['./dashboard-farmer.component.css']
})
export class DashboardFarmerComponent implements OnInit {
myTasks: any[] = [];
isLoading = true;
errorMessage = '';
userName: string | null = null;
constructor(private taskService: TaskService, private authService: AuthService) {}
ngOnInit(): void {
const currentUser = this.authService.getCurrentUser();
this.userName = currentUser ? currentUser.name : 'Farmer';
this.loadMyTasks();
}
loadMyTasks(): void {
this.isLoading = true;
this.errorMessage = '';
this.taskService.getMyTasks().subscribe({
next: (data) => {
this.myTasks = data;
this.isLoading = false;
},
error: (err) => {
this.errorMessage = 'Failed to load your tasks. Please try again later.';
this.isLoading = false;
}
});
}
// Update status function for the select dropdown
onStatusChange(taskId: string, event: Event): void {
const newStatus = (event.target as HTMLSelectElement).value;
this.taskService.updateTaskStatus(taskId, newStatus).subscribe({
next: () => {
// Find the task in the local array and update its status
const task = this.myTasks.find(t => t._id === taskId);
if (task) {
task.status = newStatus;
}
},
error: (err) => {
this.errorMessage = 'Failed to update status.';
// Optionally, revert the dropdown if the API call fails
this.loadMyTasks();
}
});
}
}