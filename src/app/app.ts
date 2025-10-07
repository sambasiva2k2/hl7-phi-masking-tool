import { Component, signal } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatGridListModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('HL7-PHI-Mask');
}
