import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  constructor(private router: Router) {}

  getCurrentUser() {
    const token = localStorage.getItem('token');
    const payload = token?.split('.')[1] ?? '';
    const userString = atob(payload);
    const currentUser = JSON.parse(userString);
    const fullName = currentUser['nombre'] + ' ' + currentUser['apellido'];
    return fullName;
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['/']);
  }
}
