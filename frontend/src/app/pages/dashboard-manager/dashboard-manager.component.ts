import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
selector: 'app-dashboard-manager',
standalone: true,
imports: [
CommonModule,
RouterLink
],
templateUrl: './dashboard-manager.component.html',
styleUrls: ['./dashboard-manager.component.css']
})
export class DashboardManagerComponent {
}