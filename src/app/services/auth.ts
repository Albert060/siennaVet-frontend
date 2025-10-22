import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface AuthI{
  email: String
  contrasena: String
}
export interface Response {
  success: boolean
  mensaje: String
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private endpoint = "http://localhost:8080/api/auth";

  constructor(private http: HttpClient) { }

  login (auth: AuthI) {
    return this.http.post<Response>(this.endpoint, auth);
  }
}
