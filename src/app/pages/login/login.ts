import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Auth } from '../../services/auth';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  public error: null | String = null;

  constructor(private service: Auth, private router: Router) { }

  login(form: NgForm) {
    const email: string = form.value['email'];
    const contrasena: string = form.value['contrasena'];

    if (!email.includes('@') || !email.includes('.com')) {
      this.error = 'Formato incorrecto de email @'
      return
    }

    if (contrasena.length < 4) {
      this.error = 'Formato incorrecto de contraseña debe tener mas de 4 caracteres'
      return
    }

    this.service.login(form.value).subscribe({
      next: (response) => {
        // response["success"] == false ? this.error = response["mensaje"] : this.router.navigate(['dashboard'])
        if (response["success"] == false) {
          this.error = response ["mensaje"]
        } else {
          localStorage.setItem("token", response.mensaje)
          this.router.navigate(['dashboard'])
        }
      },
      error: (error) => console.log(error),
    });
  }

  volver() {

    this.router.navigate(['/']);
  }
}
