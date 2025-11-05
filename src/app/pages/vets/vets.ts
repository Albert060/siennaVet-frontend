import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Veterinario, VeterinarioI } from '../../services/veterinario';

@Component({
    selector: 'app-vets',
    imports: [CommonModule, NgIf, FormsModule],
    templateUrl: './vets.html',
    styleUrl: './vets.css'
})
export class Vets implements OnInit {
    public error: null | string = null;
    public listaVeterinarios: VeterinarioI[] = [];
    public listaVeterinariosFiltrados: VeterinarioI[] = [];
    public cargando: boolean = false;
    public showModal: boolean = false;
    public showDetails: boolean = false;
    public terminoBusqueda: string = '';
    public veterinarioEditando: VeterinarioI | null = null;
    public veterinarioDetalles: VeterinarioI | null = null;
    public eliminarVeterinario: VeterinarioI | null = null;

    constructor(private service: Veterinario) { }

    ngOnInit() {
        this.cargando = true

        this.service.listarVeterinario().subscribe({
            next: (response) => {
                if (!Array.isArray(response)) {
                    this.error = "Algo salio mal"
                    this.cargando = false
                    return
                }

                if (response.length == 0) {
                    this.error = "Aun no hay datos"
                    this.cargando = false
                    return
                }

                this.listaVeterinarios = response;
                this.listaVeterinariosFiltrados = response; // Inicializar la lista filtrada con todos los veterinarios
                this.cargando = false
            },
            error: (error) => {
                this.error = 'Error del servidor'
                console.log(error)
                this.cargando = false
            },
        })
    }

    verVeterinario(veterinario: VeterinarioI) {
        this.veterinarioDetalles = veterinario;
        this.showDetails = true;
    }

    cerrarDetalles() {
        this.showDetails = false;
        this.veterinarioDetalles = null;
    }

    buscarVeterinarios() {
        if (!this.terminoBusqueda.trim()) {
            // Si no hay término de búsqueda, mostrar todos los veterinarios
            this.listaVeterinariosFiltrados = [...this.listaVeterinarios];
        } else {
            // Filtrar los veterinarios según el término de búsqueda
            const termino = this.terminoBusqueda.toLowerCase().trim();
            this.listaVeterinariosFiltrados = this.listaVeterinarios.filter(veterinario =>
                veterinario.nombre.toLowerCase().includes(termino) ||
                veterinario.apellido.toLowerCase().includes(termino) ||
                veterinario.dni.toLowerCase().includes(termino) ||
                veterinario.numColegiado.toLowerCase().includes(termino) ||
                veterinario.email.toLowerCase().includes(termino) ||
                veterinario.telefono.toLowerCase().includes(termino)
            );
        }
    }

    mostrarEditarVeterinario(veterinario: VeterinarioI) {
        this.veterinarioEditando = { ...veterinario }; // Crear una copia para evitar modificar el original
        this.showModal = true;
    }

    cerrarModal() {
        this.showModal = false;
        this.veterinarioEditando = null;
    }

    guardarVeterinario() {
        if (this.veterinarioEditando) {
            this.editarVeterinario(this.veterinarioEditando);
            this.cerrarModal();
        }
    }

    editarVeterinario(veterinarioEditado: VeterinarioI) {
        this.service.editarveterinario(veterinarioEditado).subscribe({
            next: (response) => {
                console.log(response);
                // Actualizar la lista local con los cambios
                const index = this.listaVeterinarios.findIndex(v => v.idVet === response.idVet);
                if (index !== -1) {
                    this.listaVeterinarios[index] = response;
                    // Actualizar también la lista filtrada
                    const indexFiltrado = this.listaVeterinariosFiltrados.findIndex(v => v.idVet === response.idVet);
                    if (indexFiltrado !== -1) {
                        this.listaVeterinariosFiltrados[indexFiltrado] = response;
                    }
                }
            },
            error: (error) => {
                console.error('Error al modificar el veterinario:', error);
                this.error = 'Error al modificar el veterinario';
            }
        });
    }

    mostrarEliminarVeterinario(eliminarVeterinario: VeterinarioI) {
        const confirmacion = confirm(`¿Estás seguro de eliminar el veterinario ${eliminarVeterinario.nombre} ${eliminarVeterinario.apellido}?`);
        if (confirmacion) {
            this.service.eliminarVeterinario(eliminarVeterinario).subscribe({
                next: (response) => {
                    console.log(response);
                    // Actualiza el arreglo local filtrando por id
                    this.listaVeterinarios = this.listaVeterinarios.filter(v => v.idVet !== eliminarVeterinario.idVet);
                    this.listaVeterinariosFiltrados = this.listaVeterinariosFiltrados.filter(v => v.idVet !== eliminarVeterinario.idVet);
                },
                error: (error) => {
                    console.error('Error al eliminar el veterinario', error);
                }
            });
        }
    }

    crearNuevoVeterinario() {
        this.veterinarioEditando = {
            nombre: '',
            apellido: '',
            dni: '',
            sexo: '',
            numColegiado: '',
            email: '',
            contrasena: '',
            telefono: '',
            fechaInicio: new Date().toISOString().split('T')[0] // Fecha actual en formato YYYY-MM-DD
        };
        this.showModal = true;
    }
}
