import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Auth } from '../../services/auth';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
  
export class Login {
  public error: null | String = null;
  
  constructor(private service: Auth) { }

  login(form:NgForm) {
    console.log(form.value)
    this.service.login(form.value).subscribe({
      next: (response) => response["success"] == false ? this.error = response["mensaje"] : this.error = null
    });
  }
}
