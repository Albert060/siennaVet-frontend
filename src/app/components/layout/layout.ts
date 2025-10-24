import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [Sidebar, RouterOutlet],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'] 
})
export class Layout {

}
