import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

declare var lucide: any;

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit, AfterViewInit {
  isLoggedIn = false;
  userName: string | null = null;
  userRole: string | null = null;
  dashboardLink: string | null = null;
  currentDate = new Date();

  constructor(private authService: AuthService, private router: Router) {
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
        this.updateLoginState();
        setTimeout(() => lucide.createIcons(), 0);
    });
    this.updateLoginState();
  }

  ngAfterViewInit(): void {
    lucide.createIcons();
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
    if (role === 'Admin') {
      this.dashboardLink = '/app/dashboard-admin';
    } else if (role === 'Agronomist') {
      this.dashboardLink = '/app/dashboard-agronomist';
    } else if (role === 'Operator') {
      this.dashboardLink = '/app/dashboard-operator';
    } else {
      this.dashboardLink = null;
    }
  }

  logout(): void {
    this.authService.forceLogout();
  }
}