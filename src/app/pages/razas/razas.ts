import { Component } from '@angular/core';
import { Raza, RazaI } from '../../services/raza';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-razas',
  imports: [CommonModule, FormsModule],
  templateUrl: './razas.html',
  styleUrl: './razas.css'
})
export class Razas {

  public error: null | string = null;
  public listaRaza: RazaI[] = [];
  public listaRazaFiltrados: RazaI[] = [];
  public cargando: boolean = false;
  public showModal: boolean = false;
  public showDetails: boolean = false;
  public terminoBusqueda: string = '';
  public razaEditando: RazaI | null = null;
  public razaDetalles: RazaI | null = null;
  public eliminarRaza: RazaI | null = null;

  constructor(private service: Raza) { }

  ngOnInit() {
    this.cargando = true

    this.service.listarRaza().subscribe({
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

        this.listaRaza = response;
        this.listaRazaFiltrados = response; // Inicializar la lista filtrada con todos los clientes
        this.cargando = false
      },
      error: (error) => {
        this.error = 'Error del servidor'
        console.log(error)
        this.cargando = false
      },
    })
  }

  verRaza(raza: RazaI) {
    this.razaDetalles = raza;
    this.showDetails = true;
  }

  cerrarDetalles() {
    this.showDetails = false;
    this.razaDetalles = null;
  }

  buscarRaza() {
    if (!this.terminoBusqueda.trim()) {
      // Si no hay término de búsqueda, mostrar todos los clientes
      this.listaRazaFiltrados = [...this.listaRaza];
    } else {
      // Filtrar los clientes según el término de búsqueda
      const termino = this.terminoBusqueda.toLowerCase().trim();
      this.listaRazaFiltrados = this.listaRaza.filter(raza =>
        raza.tipoRaza.toLowerCase().includes(termino) ||
        raza.nombre.toLowerCase().includes(termino)
      );
    }
  }

  mostrarEditarRaza(raza: RazaI) {
    this.razaEditando = raza;
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.razaEditando = null;
  }

  guardarRaza() {
    if (this.razaEditando) {
      this.editarRaza(this.razaEditando);
      this.cerrarModal();
    }
  }

  editarRaza(razaEditado: RazaI) {
    this.service.editarRaza(razaEditado).subscribe({
      next: (response) => {
        console.log(response);
        // Actualizar la lista localmente
        const index = this.listaRaza.findIndex(c => c.idRaza === razaEditado.idRaza);
        if (index !== -1) {
          this.listaRaza[index] = razaEditado;
          this.listaRazaFiltrados = [...this.listaRaza]; // Actualizar la lista filtrada también
        }
      },
      error: (error) => {
        console.error('Error al modificar el cliente:', error);
        this.error = 'Error al modificar el cliente';
      }
    });
  }

  mostrarEliminarRaza(eliminarRaza: RazaI) {
    const confirmacion = confirm(`¿Estás seguro de eliminar el cliente con id ${eliminarRaza.idRaza}?`);
    if (confirmacion) {
      this.service.eliminarRaza(eliminarRaza).subscribe({
        next: (response) => {
          console.log(response);
          // Actualiza el arreglo local filtrando por id
          this.listaRaza = this.listaRaza.filter(c => c.idRaza !== eliminarRaza.idRaza);
          this.listaRazaFiltrados = [...this.listaRaza]; // Actualizar la lista filtrada también
        },
        error: (error) => {
          console.error('Error al eliminar el cliente', error);
        }
      });
    }
  }

  crearNuevaRaza() {
    this.razaEditando = {
      tipoRaza: '',
      nombre: '',
    };
    this.showModal = true;
  }
}
