import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; // Import Router

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  // Inject Router here
  constructor(private http: HttpClient, private router: Router) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  storeUserData(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // This is the old logout method
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // --- NEW, ROBUST LOGOUT METHOD ---
  // This method will now be used by the UI. It ensures a clean state.
  forceLogout() {
    // 1. Clear all items from local storage
    localStorage.clear();
    // 2. Navigate to the login page and then force a full page reload.
    // This guarantees that no old data (like invalid tokens) remains in the application's memory.
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}