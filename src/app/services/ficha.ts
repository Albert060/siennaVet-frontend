import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

export interface FichaAnimales{
  idFicha?: number;
  nombre: string;
  sexo: string;
  edad: string;
  peso: string;
  chip: string;
  raza: string;
  idRaza: number;
  idCliente: number;
}

@Injectable({
  providedIn: 'root'
})
export class Ficha {
  private endpoint = "http://localhost:8080/api/fichas";

  constructor(private http: HttpClient) { }

  listarFicha(offset = 0, limit = 1000) {
    return this.http.get<FichaAnimales[]>(`${this.endpoint}?offset=${offset}&limit=${limit}`)
  }

  editarFicha(editarFicha: FichaAnimales) {
    return this.http.put<FichaAnimales>(this.endpoint, editarFicha)
  }

  crearFicha(crearFicha: FichaAnimales) {
    return this.http.post<FichaAnimales>(this.endpoint, crearFicha)
  }

  eliminarFicha(eliminarFicha: FichaAnimales) {
    return this.http.delete<FichaAnimales>(`${this.endpoint}/${eliminarFicha.idFicha}`)
  }
}
