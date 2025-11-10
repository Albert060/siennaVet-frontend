import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente, ClienteI } from '../../services/cliente';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {

  public error: null | string = null;
  public listaClientes: ClienteI[] = [];
  public listaClientesFiltrados: ClienteI[] = [];
  public cargando: boolean = false;
  public showModal: boolean = false;
  public showDetails: boolean = false;
  public terminoBusqueda: string = '';
  public clienteEditando: ClienteI | null = null;
  public clienteDetalles: ClienteI | null = null;
  public eliminarCliente: ClienteI | null = null;

  constructor(private service: Cliente) { }

  ngOnInit() {
    this.cargando = true

    this.service.listarCliente().subscribe({
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

        this.listaClientes = response;
        this.listaClientesFiltrados = response; // Inicializar la lista filtrada con todos los clientes
        this.cargando = false
      },
      error: (error) => {
        this.error = 'Error del servidor'
        console.log(error)
        this.cargando = false
      },
    })
  }

  verCliente(cliente: ClienteI) {
    this.clienteDetalles = cliente;
    this.showDetails = true;
  }

  cerrarDetalles() {
    this.showDetails = false;
    this.clienteDetalles = null;
  }

  buscarClientes() {
    if (!this.terminoBusqueda.trim()) {
      // Si no hay término de búsqueda, mostrar todos los clientes
      this.listaClientesFiltrados = [...this.listaClientes];
    } else {
      // Filtrar los clientes según el término de búsqueda
      const termino = this.terminoBusqueda.toLowerCase().trim();
      this.listaClientesFiltrados = this.listaClientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(termino) ||
        cliente.apellido.toLowerCase().includes(termino) ||
        cliente.dni.toLowerCase().includes(termino) ||
        cliente.direccion.toLowerCase().includes(termino) ||
        cliente.telefono.toLowerCase().includes(termino) ||
        cliente.codigoPostal.toLowerCase().includes(termino)
      );
    }
  }

  mostrarEditarCliente(cliente: ClienteI) {
    this.clienteEditando = cliente;
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.clienteEditando = null;
  }

  guardarCliente() {
    if (this.clienteEditando) {
      this.editarCliente(this.clienteEditando);
      this.cerrarModal();
    }
  }

  editarCliente(clienteEditado: ClienteI) {
    this.service.editarcliente(clienteEditado).subscribe({
      next: (response) => {
        console.log(response);
        // Actualizar la lista localmente
        const index = this.listaClientes.findIndex(c => c.idCliente === clienteEditado.idCliente);
        if (index !== -1) {
          this.listaClientes[index] = clienteEditado;
          this.listaClientesFiltrados = [...this.listaClientes]; // Actualizar la lista filtrada también
        }
      },
      error: (error) => {
        console.error('Error al modificar el cliente:', error);
        this.error = 'Error al modificar el cliente';
      }
    });
  }

  mostrarEliminarCliente(eliminarCliente: ClienteI) {
    const confirmacion = confirm(`¿Estás seguro de eliminar el cliente con id ${eliminarCliente.idCliente}?`);
    if (confirmacion) {
      this.service.eliminarCliente(eliminarCliente).subscribe({
        next: (response) => {
          console.log(response);
          // Actualiza el arreglo local filtrando por id
          this.listaClientes = this.listaClientes.filter(c => c.idCliente !== eliminarCliente.idCliente);
          this.listaClientesFiltrados = [...this.listaClientes]; // Actualizar la lista filtrada también
        },
        error: (error) => {
          console.error('Error al eliminar el cliente', error);
        }
      });
    }
  }

  crearNuevoCliente() {
    this.clienteEditando = {
      nombre: '',
      apellido: '',
      dni: '',
      direccion: '',
      telefono: '',
      codigoPostal: ''
    };
    this.showModal = true;
  }
}
