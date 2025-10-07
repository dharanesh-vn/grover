import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  // The template is now just the router outlet. No sidebar, no header.
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'frontend';
}