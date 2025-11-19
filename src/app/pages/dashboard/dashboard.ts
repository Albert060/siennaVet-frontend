import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ficha, FichaAnimales } from '../../services/ficha';
import {Raza, RazaI} from '../../services/raza';
import {Cliente, ClienteI} from '../../services/cliente';

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
  public razasDisponibles: RazaI[] = [];
  public clientesDisponibles: ClienteI[] = [];
  public esCreacion: boolean = false; // Flag to determine if we're creating or editing
  public offset = 0;
  public limit = 6;
  public isPagina: boolean = false;

  constructor(private service: Ficha, private razaService: Raza, private clienteService: Cliente) { }

  ngOnInit() {
    this.cargando = true

    this.razaService.listarRaza().subscribe({
      next: (response) => {
        this.razasDisponibles = response;
      }
    });

    this.clienteService.listarCliente().subscribe({
      next: (response) => {
        this.clientesDisponibles = response;
      }
    });

    this.service.listarFicha(this.offset, this.limit).subscribe({
      next: (response) => {
        if (!Array.isArray(response)) {
          this.error = "Algo salio mal";
          this.cargando = false;
          return;
        }

        if (response.length === 0 && !this.isPagina) {
          this.error = "Aun no hay datos";
          this.cargando = false;
          return;
        }

        if (response.length === 0 && this.isPagina) {
          this.offset = 0;
          this.cargarFichas();
          return;
        }

        this.listaFichas = response;
        this.listaFichasFiltradas = [...response]; // Inicializar la lista filtrada con todas las fichas
        this.cargando = false;
      },
      error: (error) => {
        this.error = 'Error del servidor';
        console.log(error);
        this.cargando = false;
      },
    });
  }

  cargarFichas() {
    this.cargando = true;

    this.service.listarFicha(this.offset, this.limit).subscribe({
      next: (response) => {
        if (!Array.isArray(response)) {
          this.error = "Algo salio mal";
          this.cargando = false;
          return;
        }

        if (response.length === 0 && this.offset > 0) {
          this.offset = 0;
          this.cargarFichas();
          return;
        }

        this.listaFichas = response;
        this.listaFichasFiltradas = [...response];
        this.cargando = false;
      },
      error: (error) => {
        this.error = 'Error del servidor';
        console.log(error);
        this.cargando = false;
      },
    });
  }

  siguientePagina() {
    this.isPagina = true;
    this.offset++;
    this.cargarFichas();
  }

  anteriorPagina() {
    this.isPagina = true;
    if (this.offset <= 0) {
      this.offset = 0;
      return;
    }
    this.offset--;
    this.cargarFichas();
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
        this.getNombreRaza(ficha.idRaza).toLowerCase().includes(termino) ||
        this.getNombreCliente(ficha.idCliente).toLowerCase().includes(termino)
      );
    }
  }

  crearNuevaFicha() {
    this.esCreacion = true;
    // Initialize a new empty ficha object
    this.fichaEditando = {
      nombre: '',
      sexo: 'Macho', // Default value
      edad: '',
      peso: '',
      chip: '',
      raza: '', // This will be derived from idRaza
      idRaza: 0,
      idCliente: 0
    };
    this.showModal = true;

    // Load available breeds and clients
    this.razaService.listarRaza().subscribe({
      next: (response) => {
        this.razasDisponibles = response;
      }
    });

    this.clienteService.listarCliente().subscribe({
      next: (response) => {
        this.clientesDisponibles = response;
      }
    });
  }

  mostrarEditarFicha(ficha: FichaAnimales) {
    this.esCreacion = false;
    this.fichaEditando = ficha;
    this.showModal = true;

    // Load available breeds and clients
    this.razaService.listarRaza().subscribe({
      next: (response) => {
        this.razasDisponibles = response;
      }
    });

    this.clienteService.listarCliente().subscribe({
      next: (response) => {
        this.clientesDisponibles = response;
      }
    });
  }

  cerrarModal() {
    this.showModal = false;
    this.fichaEditando = null;
  }

  guardarFicha() {
    if (this.fichaEditando) {
      if (this.esCreacion) {
        this.crearFicha(this.fichaEditando);
      } else {
        this.editarFicha(this.fichaEditando);
      }
      this.cerrarModal();
    }
  }

  crearFicha(nuevaFicha: FichaAnimales) {
    this.service.crearFicha(nuevaFicha).subscribe({
      next: (response) => {
        console.log('Ficha creada:', response);
        // Add the new ficha to the list
        this.listaFichas.push(response);
        this.listaFichasFiltradas.push(response);
      },
      error: (error) => {
        console.error('Error al crear la ficha:', error);
        this.error = 'Error al crear la ficha';
      }
    });
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

  getNombreRaza(idRaza: number): string {
    if (this.razasDisponibles.length === 0) {
      // If razas haven't been loaded yet, return a placeholder
      return 'Cargando...';
    }
    const raza = this.razasDisponibles.find(r => r.idRaza === idRaza);
    return raza ? raza.nombre : 'Raza no encontrada';
  }

  getNombreCliente(idCliente: number): string {
    if (this.clientesDisponibles.length === 0) {
      // If clientes haven't been loaded yet, return a placeholder
      return 'Cargando...';
    }
    const cliente = this.clientesDisponibles.find(c => c.idCliente === idCliente);
    return cliente ? cliente.nombre + ' ' + cliente.apellido : 'Cliente no encontrado';
  }
}
