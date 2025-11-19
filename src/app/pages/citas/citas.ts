import {Component, OnInit, HostListener} from '@angular/core';
import {Cliente, ClienteI} from '../../services/cliente';
import {Cita, CitaI} from '../../services/cita';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Veterinario, VeterinarioI } from '../../services/veterinario';
import { Ficha, FichaAnimales } from '../../services/ficha';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-citas',
    templateUrl: "./citas.html",
    styleUrls: ["./citas.css"],
    imports: [CommonModule, FormsModule]
})
export class Citas implements OnInit {

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Cerrar el menú si se hace clic fuera de él
    if (!(event.target as Element).closest('.appointment-badge')) {
      this.citaSeleccionada = null;
    }
  }

  public citaSeleccionada: CitaI | null = null;

  public error: null | string = null;
  public listarCitas: CitaI[] = [];
  public listaCitasFiltrados: CitaI[] = [];
  public cargando: boolean = false;
  public showModal: boolean = false;
  public showDetails: boolean = false;
  public terminoBusqueda: string = '';
  public citasEditando: CitaI | null = null;
  public citasDetalles: CitaI | null = null;
  public eliminarCitas: CitaI | null = null;
  public mesActual: Date = new Date();
  public diasCalendario: (Date | null)[] = [];
  public fechaSeleccionada: Date | null = null;
  public vetsDisponibles: VeterinarioI[] = [];
  public fichasDisponibles: FichaAnimales[] = [];
  public clientes: ClienteI[] = [];

  constructor(private service: Cita, private vetService: Veterinario, private fichaService: Ficha, private clienteService: Cliente) { }

  verCitas(cita: CitaI) {
    this.citasDetalles = cita;
    this.showDetails = true;
  }

  cerrarDetalles() {
    this.showDetails = false;
    this.citasDetalles = null;
  }

  buscarCitas() {
    if (!this.terminoBusqueda.trim()) {
      // Si no hay término de búsqueda, mostrar todos los clientes
      this.listaCitasFiltrados = [...this.listarCitas];
    } else {
      // Filtrar los clientes según el término de búsqueda
      const termino = this.terminoBusqueda.toLowerCase().trim();
      this.listaCitasFiltrados = this.listarCitas.filter(cita =>
        cita.idCita?.toString().toLowerCase().includes(termino) ||
        cita.fecha.toLowerCase().includes(termino) ||
        cita.detalles.toLowerCase().includes(termino) ||
        cita.hora.toLowerCase().includes(termino) ||
        this.getNombreFicha(cita.idFicha || 0).toLowerCase().includes(termino) ||
        this.getNombreVet(cita.idVet || 0).toLowerCase().includes(termino)
      );
    }
    // Regenerar el calendario para reflejar los resultados de búsqueda
    this.generarCalendario();
  }

  mostrarEditarCita(cita: CitaI) {
    // Create a copy to avoid direct reference issues
    this.citasEditando = {
      idCita: cita.idCita,
      fecha: cita.fecha,
      detalles: cita.detalles,
      hora: cita.hora,
      idFicha: cita.idFicha || 0,
      idVet: cita.idVet || 0
    };
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.citasEditando = null;
  }

  editarCitas(citasEditando: CitaI) {
    this.service.editarCitas(citasEditando).subscribe({
      next: (response) => {
        console.log(response);
        // Actualizar la lista localmente
        const index = this.listarCitas.findIndex(c => c.idCita === citasEditando.idCita);
        if (index !== -1) {
          this.listarCitas[index] = citasEditando;
          this.listaCitasFiltrados = [...this.listarCitas]; // Actualizar la lista filtrada también
        }
      },
      error: (error) => {
        console.error('Error al modificar la cita:', error);
        this.error = 'Error al modificar la cita';
      }
    });
  }

  mostrarEliminarCitas(eliminarCitas: CitaI) {
    const confirmacion = confirm(`¿Estás seguro de eliminar el cliente con id ${eliminarCitas.idCita}?`);
    if (confirmacion) {
      this.service.eliminarCitas(eliminarCitas).subscribe({
        next: (response) => {
          console.log(response);
          // Actualiza el arreglo local filtrando por id
          this.listarCitas = this.listarCitas.filter(c => c.idCita !== eliminarCitas.idCita);
          this.listaCitasFiltrados = [...this.listarCitas]; // Actualizar la lista filtrada también
        },
        error: (error) => {
          console.error('Error al eliminar la cita', error);
        }
      });
    }
  }

  ngOnInit() {
    this.cargando = true;

    // Load all required data concurrently
    forkJoin({
      citas: this.service.listarCitas(),
      vets: this.vetService.listarVeterinario(),
      fichas: this.fichaService.listarFicha(),
      clientes: this.clienteService.listarCliente()
    }).subscribe({
      next: (responses) => {
        // Handle appointments response
        if (!Array.isArray(responses.citas)) {
          this.error = "Algo salio mal";
          this.cargando = false;
          return;
        }

        if (responses.citas.length == 0) {
          this.error = "Aun no hay datos";
          this.cargando = false;
        }

        console.log(responses);

        this.listarCitas = responses.citas;
        this.listaCitasFiltrados = responses.citas;

        // Handle vets response
        this.vetsDisponibles = responses.vets;

        // Handle fichas response
        this.fichasDisponibles = responses.fichas;

        // Handle clientes response
        this.clientes = responses.clientes;

        this.cargando = false;

        // Generate calendar after loading all data
        this.generarCalendario();
      },
      error: (error) => {
        this.error = 'Error del servidor';
        console.log(error);
        this.cargando = false;
      }
    });
  }

  generarCalendario() {
    const year = this.mesActual.getFullYear();
    const month = this.mesActual.getMonth();

    // Primer día del mes
    const primerDia = new Date(year, month, 1);
    // Último día del mes
    const ultimoDia = new Date(year, month + 1, 0);
    // Día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
    const diaSemanaPrimerDia = primerDia.getDay();

    this.diasCalendario = [];

    // Agregar días en blanco del final del mes anterior
    for (let i = 0; i < diaSemanaPrimerDia; i++) {
      this.diasCalendario.push(null);
    }

    // Agregar todos los días del mes actual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      this.diasCalendario.push(new Date(year, month, dia));
    }
  }

  cambiarMes(cantidad: number) {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + cantidad, 1);
    this.generarCalendario();
  }

  esHoy(dia: Date): boolean {
    const hoy = new Date();
    return dia.getDate() === hoy.getDate() &&
           dia.getMonth() === hoy.getMonth() &&
           dia.getFullYear() === hoy.getFullYear();
  }

  esMesActual(dia: Date): boolean {
    return dia.getMonth() === this.mesActual.getMonth() &&
           dia.getFullYear() === this.mesActual.getFullYear();
  }

  getCitasDelDia(dia: Date): CitaI[] {
    if (!this.listaCitasFiltrados) return [];

    const fechaStr =dia.getFullYear() + '-' +
      String(dia.getMonth() + 1).padStart(2, '0') + '-' +
      String(dia.getDate()).padStart(2, '0'); // Convert date to YYYY-MM-DD format
    return this.listaCitasFiltrados.filter(cita => cita.fecha === fechaStr);
  }

  abrirModalCrear() {
    // Abrir modal con campos vacíos para crear una nueva cita
    this.citasEditando = {
      fecha: new Date().toISOString().split('T')[0], // Fecha actual
      detalles: '',
      hora: '',
      idFicha: 0,  // Initialize with 0, user will select
      idVet: 0     // Initialize with 0, user will select
    };
    this.showModal = true;
  }

  onDayClick(dia: Date) {
    console.log(dia);
    this.fechaSeleccionada = dia;
    // Prellenar la fecha en el formulario de nueva cita
    const fechaFormateada = dia.getFullYear() + '-' +
      String(dia.getMonth() + 1).padStart(2, '0') + '-' +
      String(dia.getDate()).padStart(2, '0');

    console.log(fechaFormateada);
    this.citasEditando = {
      fecha: fechaFormateada,
      detalles: '',
      hora: '',
      idFicha: 0,  // Initialize with 0, user will select
      idVet: 0     // Initialize with 0, user will select
    };

    this.showModal = true;
  }

  guardarCitas() {
    if (this.citasEditando) {
      if (this.citasEditando.idCita) {
        // Editar cita existente
        this.service.editarCitas(this.citasEditando).subscribe({
          next: (response) => {
            console.log(response);
            // Actualizar la lista localmente
            const index = this.listarCitas.findIndex(c => c.idCita === this.citasEditando?.idCita);
            if (index !== -1) {
              if (this.citasEditando) {
                this.listarCitas[index] = this.citasEditando;
              }
              this.listaCitasFiltrados = [...this.listarCitas]; // Actualizar la lista filtrada también
            }
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al modificar la cita:', error);
            this.error = 'Error al modificar la cita';
          }
        });
      } else {
        // Crear nueva cita
        this.service.crearCitas(this.citasEditando).subscribe({
          next: (response) => {
            console.log('Cita creada:', response);
            // Agregar la nueva cita a la lista
            this.listaCitasFiltrados.push(response);
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al crear la cita:', error);
            this.error = 'Error al crear la cita';
          }
        });
      }
    }
  }

  getNombreClienteFicha(idCliente: number): string {
    if (this.clientes.length === 0) {
      return 'Cargando...';
    }
    const cliente = this.clientes.find(c => c.idCliente === idCliente);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente no encontrado';
  }

  getNombreFicha(idFicha: number): string {
    if (this.fichasDisponibles.length === 0) {
      return 'Cargando...';
    }
    const ficha = this.fichasDisponibles.find(f => f.idFicha === idFicha);
    if (ficha) {
      // Find the client for this ficha
      const cliente = this.clientes.find(c => c.idCliente === ficha.idCliente);
      return cliente ? `${ficha.nombre} (${cliente.nombre} ${cliente.apellido})` : ficha.nombre;
    }
    return 'Ficha no encontrada';
  }

  getNombreVet(idVet: number): string {
    if (this.vetsDisponibles.length === 0) {
      return 'Cargando...';
    }
    const vet = this.vetsDisponibles.find(v => v.idVet === idVet);
    return vet ? `${vet.nombre} ${vet.apellido}` : 'Veterinario no encontrado';
  }

  toggleMenuCita(cita: CitaI) {
    if (this.citaSeleccionada && this.citaSeleccionada.idCita === cita.idCita) {
      // Si ya está abierto, lo cerramos
      this.citaSeleccionada = null;
    } else {
      // Lo abrimos
      this.citaSeleccionada = cita;
    }
  }

  cerrarMenuCita() {
    this.citaSeleccionada = null;
  }
}
