import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface VeterinarioI {
    idVet?: number;
    nombre: string;
    apellido: string;
    dni: string;
    sexo: string;
    numColegiado: string;
    email: string;
    contrasena: string;
    telefono: string;
    fechaInicio: string;

}
@Injectable({
    providedIn: 'root'
})
export class Veterinario {
    private endpoint = "http://localhost:8080/api/veterinarios";

    constructor(private http: HttpClient) { }

    crearVeterinario(crearVeterinario: VeterinarioI) {
        return this.http.post<VeterinarioI>(this.endpoint, crearVeterinario)
    }

    listarVeterinario() {
        return this.http.get<VeterinarioI[]>(this.endpoint)
    }

    editarveterinario(editarVeterinario: VeterinarioI) {
        return this.http.put<VeterinarioI>(this.endpoint, editarVeterinario)
    }

    eliminarVeterinario(eliminarVeterinario: VeterinarioI) {
        return this.http.delete<VeterinarioI>(`${this.endpoint}/${eliminarVeterinario.idVet}`)
    }
}
