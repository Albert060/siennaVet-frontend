import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface FichaAnimales{
  idFicha: number;
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

  listarFicha() {
    return this.http.get<FichaAnimales[]>(this.endpoint)
  }

  editarFicha(editarFicha: FichaAnimales) {
    return this.http.put<FichaAnimales>(this.endpoint, editarFicha)
  }

  eliminarFicha(eliminarFicha: FichaAnimales) {
    return this.http.delete<FichaAnimales>(`${this.endpoint}/${eliminarFicha.idFicha}`)
  }
}
