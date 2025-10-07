import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) { }

  // Manager-only: Create a new task
  createTask(taskData: any): Observable<any> {
    return this.http.post(this.apiUrl, taskData);
  }

  // Manager-only: Get all tasks
  getAllTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // New: Get tasks for the currently logged-in user
  getMyTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mytasks`);
  }

  // Manager-only: Full update of a task
  updateTask(id: string, taskData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, taskData);
  }

  // New: Update only the status of a task
  updateTaskStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }

  // Manager-only: Delete a task
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}