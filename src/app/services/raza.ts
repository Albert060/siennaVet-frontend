import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface RazaI {
    idRaza?: number;
    tipoRaza: string;
    nombre: string;
}

@Injectable({
    providedIn: 'root'
})
export class Raza {
    private endpoint = "http://localhost:8080/api/razas";

    constructor(private http: HttpClient) { }

    crearRaza(crearRaza: RazaI) {
        return this.http.post<RazaI>(this.endpoint, crearRaza)
    }

    listarRaza(offset = 0, limit = 1000) {
        return this.http.get<RazaI[]>(`${this.endpoint}?offset=${offset}&limit=${limit}`)
    }

    editarRaza(editarRaza: RazaI) {
        return this.http.put<RazaI>(this.endpoint, editarRaza)
    }

    eliminarRaza(eliminarRaza: RazaI) {
        return this.http.delete<RazaI>(`${this.endpoint}/${eliminarRaza.idRaza}`)
    }
}
