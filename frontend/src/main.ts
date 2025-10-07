import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Import withInterceptors
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth-interceptor'; // Import the interceptor

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    // Configure the app to provide HttpClient and use our new interceptor
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
}).catch(err => console.error(err));