import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface AuthI{
  email: string
  contrasena: string
}
export interface Response {
  success: boolean
  mensaje: string
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private endpoint = "https://siennavet-backend.onrender.com/api/auth";

  constructor(private http: HttpClient) { }

  login (auth: AuthI) {
    return this.http.post<Response>(this.endpoint, auth);
  }
}
