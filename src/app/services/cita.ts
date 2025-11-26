import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface CitaI {
  idCita?: number;
  fecha: string;
  detalles: string;
  hora: string;
  idFicha?: number;
  idVet?: number;

}

@Injectable({
  providedIn: 'root'
})
export class Cita {
  private endpoint = "http://localhost:8080/api/citas";

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<CitaI[]>(this.endpoint)
  }

  editarCitas(editarCitas: CitaI) {
    return this.http.put<CitaI>(this.endpoint, editarCitas)
  }

  crearCitas(crearCitas: CitaI) {
    return this.http.post<CitaI>(this.endpoint, crearCitas)
  }

  eliminarCitas(eliminarCitas: CitaI) {
    return this.http.delete<CitaI>(`${this.endpoint}/${eliminarCitas.idCita}`)
  }
}
