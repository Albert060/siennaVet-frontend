import { Component, OnInit } from '@angular/core';
import { Contacto } from '../../services/contacto';
import { Router } from '@angular/router';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact implements OnInit {
  public error: null | String = null;
  public isFirstLoad = true;
  emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  ngOnInit(): void {
  }

  constructor(private service: Contacto, private router: Router) { }

  formContact(form: NgForm) {
    this.isFirstLoad = false;
    if (form.invalid) {
      console.log("es invalido")
      return;
    }

    const nombre: string = form.value['name'];
    const email: string = form.value['email'];
    const servicio: string = form.value['service'];
    const mensaje: string = form.value['mensaje'];

    console.log({ nombre, email, servicio, mensaje });

    this.service.crearContacto({
      nombre,
      email,
      servicio,
      mensaje
    }).subscribe({
      next: (response) => {
        form.reset()
      },
      error: (error) => console.log(error),
    });
  }
}
