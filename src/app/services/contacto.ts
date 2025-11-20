import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ContactoI {
  idContacto?: number;
  nombre: string;
  email: string;
  servicio: string;
  mensaje: string;

}
@Injectable({
  providedIn: 'root'
})
export class Contacto {
  private endpoint = "http://localhost:8080/api/contactos";

  constructor(private http: HttpClient) { }

  crearContacto(crearContacto: ContactoI) {
    return this.http.post<ContactoI>(this.endpoint, crearContacto)
  }

  listarContacto(offset = 0, limit = 1000) {
    return this.http.get<ContactoI[]>(`${this.endpoint}?offset=${offset}&limit=${limit}`)
  }

  editarcontacto(editarContacto: ContactoI) {
    return this.http.put<ContactoI>(this.endpoint, editarContacto)
  }

  eliminarContacto(eliminarContacto: ContactoI) {
    return this.http.delete<ContactoI>(`${this.endpoint}/${eliminarContacto.idContacto}`)
  }
}
