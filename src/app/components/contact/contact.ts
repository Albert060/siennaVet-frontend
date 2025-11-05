import { Component } from '@angular/core';
import { Contacto } from '../../services/contacto';
import { Router } from '@angular/router';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  public error: null | String = null;

  constructor(private service: Contacto, private router: Router) { }

  formContact(form: NgForm) {
    const nombre: string = form.value['name'];
    const email: string = form.value['email'];
    const servicio: string = form.value['service'];
    const mensaje: string = form.value['mensaje'];

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
