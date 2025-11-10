import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ficha, FichaAnimales } from '../../services/ficha';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: "./dashboard.html",
  styleUrls: ["./dashboard.css"]
})

export class Dashboard implements OnInit {
  public error: null | string = null;
  public listaFichas: FichaAnimales[] = [];
  public listaFichasFiltradas: FichaAnimales[] = [];
  public cargando: boolean = false;
  public showModal: boolean = false;
  public showDetails: boolean = false;
  public terminoBusqueda: string = '';
  public fichaEditando: FichaAnimales | null = null;
  public fichaDetalles: FichaAnimales | null = null;
  public eliminarFicha: FichaAnimales | null = null;

  constructor(private service: Ficha) { }

  ngOnInit() {
    this.cargando = true

    this.service.listarFicha().subscribe({
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

        this.listaFichas = response;
        this.listaFichasFiltradas = response; // Inicializar la lista filtrada con todas las fichas
        this.cargando = false
      },
      error: (error) => {
        this.error = 'Error del servidor'
        console.log(error)
        this.cargando = false
      },
    })
  }

  verFicha(ficha: FichaAnimales) {
    this.fichaDetalles = ficha;
    this.showDetails = true;
  }

  cerrarDetalles() {
    this.showDetails = false;
    this.fichaDetalles = null;
  }

  buscarFichas() {
    if (!this.terminoBusqueda.trim()) {
      // Si no hay término de búsqueda, mostrar todas las fichas
      this.listaFichasFiltradas = [...this.listaFichas];
    } else {
      // Filtrar las fichas según el término de búsqueda
      const termino = this.terminoBusqueda.toLowerCase().trim();
      this.listaFichasFiltradas = this.listaFichas.filter(ficha =>
        ficha.nombre.toLowerCase().includes(termino) ||
        ficha.sexo.toLowerCase().includes(termino) ||
        ficha.edad.toLowerCase().includes(termino) ||
        ficha.peso.toLowerCase().includes(termino) ||
        ficha.chip.toLowerCase().includes(termino) ||
        ficha.raza.toLowerCase().includes(termino)
      );
    }
  }

  mostrarEditarFicha(ficha: FichaAnimales) {
    this.fichaEditando = ficha;
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.fichaEditando = null;
  }

  guardarFicha() {
    if (this.fichaEditando) {
      this.editarFicha(this.fichaEditando);
      this.cerrarModal();
    }
  }

  editarFicha(fichaEditada: FichaAnimales) {
    this.service.editarFicha(fichaEditada).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error('Error al modificar la ficha:', error);
        this.error = 'Error al modificar la ficha';
      }
    });
  }

  mostrarEliminarFicha(eliminarFicha: FichaAnimales) {
    const confirmacion = confirm(`¿Estás seguro de eliminar la ficha con id ${eliminarFicha.idFicha}?`);
    if (confirmacion) {
      this.service.eliminarFicha(eliminarFicha).subscribe({
        next: (response) => {
          console.log(response);
          // Actualiza el arreglo local filtrando por id
          this.listaFichas = this.listaFichas.filter(f => f.idFicha !== eliminarFicha.idFicha);
        },
        error: (error) => {
          console.error('Error al eliminar la ficha', error);
        }
      });
    }
  }
}
