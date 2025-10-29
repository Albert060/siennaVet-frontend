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
}
