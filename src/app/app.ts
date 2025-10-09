import { Component, signal } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { RouterOutlet } from '@angular/router';
import {MatDividerModule} from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatGridListModule, MatDividerModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('HL7-PHI-Mask');
}
