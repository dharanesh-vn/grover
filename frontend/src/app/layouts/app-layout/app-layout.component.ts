import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {
  isLoggedIn = false;
  userName: string | null = null;
  userRole: string | null = null;
  dashboardLink: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
        this.updateLoginState();
    });
    this.updateLoginState();
  }

  updateLoginState(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
        const user = this.authService.getCurrentUser();
        this.userName = user ? user.name : null;
        this.userRole = user ? user.role : null;
        this.setDashboardLink(this.userRole);
    } else {
        this.userName = null;
        this.userRole = null;
        this.dashboardLink = null;
    }
  }

  setDashboardLink(role: string | null): void {
    if (role === 'Manager') {
      this.dashboardLink = '/app/dashboard-manager';
    } else if (role === 'Farmer') {
      this.dashboardLink = '/app/dashboard-farmer';
    } else if (role === 'Worker') {
      this.dashboardLink = '/app/dashboard-worker';
    } else {
      this.dashboardLink = null;
    }
  }

  logout(): void {
    this.authService.forceLogout();
  }
}