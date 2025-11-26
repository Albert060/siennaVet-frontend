import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FichaActualizacion {
  idFichaActualizacion?: number;
  comentario: string;
  fecha: string; // date format
  hora: string;  // time format
  esUrgencia: boolean;
  costo: number;
  formaPago: string;
  idFicha: number;
  idVet: number;
}

@Injectable({
  providedIn: 'root'
})
export class FichaActualizacionService {
  private endpoint = "http://localhost:8080/api/fichaActualizadas";

  constructor(private http: HttpClient) { }

  listar(offset = 0, limit = 1000) {
    return this.http.get<FichaActualizacion[]>(`${this.endpoint}?offset=${offset}&limit=${limit}`);
  }

  crearFichaActualizacion(crearFichaActualizacion: FichaActualizacion) {
    return this.http.post<FichaActualizacion>(this.endpoint, crearFichaActualizacion);
  }

  editarFichaActualizacion(editarFichaActualizacion: FichaActualizacion) {
    return this.http.put<FichaActualizacion>(this.endpoint, editarFichaActualizacion);
  }

  eliminarFichaActualizacion(eliminarFichaActualizacion: FichaActualizacion) {
    const id = eliminarFichaActualizacion.idFichaActualizacion;
    return this.http.delete<FichaActualizacion>(`${this.endpoint}/${id}`);
  }
}
