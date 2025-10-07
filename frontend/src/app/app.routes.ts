import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { WeatherComponent } from './pages/weather/weather.component';
import { DashboardManagerComponent } from './pages/dashboard-manager/dashboard-manager.component';
import { DashboardFarmerComponent } from './pages/dashboard-farmer/dashboard-farmer.component';
import { DashboardWorkerComponent } from './pages/dashboard-worker/dashboard-worker.component';
import { CropManagementComponent } from './pages/crop-management/crop-management.component';
import { TaskManagementComponent } from './pages/task-management/task-management.component';
import { InventoryManagementComponent } from './pages/inventory-management/inventory-management.component';
import { ViewInventoryComponent } from './pages/view-inventory/view-inventory.component';
import { FieldLogViewerComponent } from './pages/field-log-viewer/field-log-viewer.component'; // Import new component
import { authGuard } from './guards/auth.guard';

import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', component: HomeComponent, pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent }
        ]
    },
    {
        path: 'app',
        component: AppLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'weather', component: WeatherComponent },
            { path: 'dashboard-manager', component: DashboardManagerComponent },
            { path: 'dashboard-farmer', component: DashboardFarmerComponent },
            { path: 'dashboard-worker', component: DashboardWorkerComponent },
            { path: 'manage-crops', component: CropManagementComponent },
            { path: 'manage-tasks', component: TaskManagementComponent },
            { path: 'manage-inventory', component: InventoryManagementComponent },
            { path: 'view-inventory', component: ViewInventoryComponent },
            { path: 'view-field-logs', component: FieldLogViewerComponent } // Add new route
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];