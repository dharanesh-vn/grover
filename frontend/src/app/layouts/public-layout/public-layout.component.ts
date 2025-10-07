import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicHeaderComponent } from '../../components/public-header/public-header.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, PublicHeaderComponent],
  templateUrl: './public-layout.component.html',
  // The 'styleUrls' property has been completely removed.
  // Angular will no longer look for a CSS file for this component.
})
export class PublicLayoutComponent {

}