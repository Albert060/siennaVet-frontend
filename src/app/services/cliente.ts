import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ClienteI {
    idCliente?: number;
    nombre: string;
    apellido: string;
    dni: string;
    direccion: string;
    telefono: string;
    codigoPostal: string;

}
@Injectable({
    providedIn: 'root'
})
export class Cliente {
    private endpoint = "http://localhost:8080/api/clientes";

    constructor(private http: HttpClient) { }

    crearCliente(crearCliente: ClienteI) {
        return this.http.post<ClienteI>(this.endpoint, crearCliente)
    }

    listarCliente(offset = 0, limit = 1000) {
        return this.http.get<ClienteI[]>(`${this.endpoint}?offset=${offset}&limit=${limit}`)
    }

    editarcliente(editarCliente: ClienteI) {
        return this.http.put<ClienteI>(this.endpoint, editarCliente)
    }

    eliminarCliente(eliminarCliente: ClienteI) {
        return this.http.delete<ClienteI>(`${this.endpoint}/${eliminarCliente.idCliente}`)
    }
}
