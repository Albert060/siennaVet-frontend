import {Component, OnInit} from '@angular/core';
import {Contacto, ContactoI} from '../../services/contacto';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-mensajes',
  imports: [FormsModule],
  templateUrl: './mensajes.html',
  styleUrl: './mensajes.css'
})
export class Mensajes implements OnInit {
  public error: null | string = null;
  public listaContacto: ContactoI[] = [];
  public listaContactoFiltrados: ContactoI[] = [];
  public cargando: boolean = false;
  public showModal: boolean = false;
  public showDetails: boolean = false;
  public terminoBusqueda: string = '';
  public contactoEditando: ContactoI | null = null;
  public mensajeDetalles: ContactoI | null = null;
  public eliminarContacto: ContactoI | null = null;
  public offset = 0;
  public limit = 6;
  public isPagina: boolean = false;

  constructor(private service: Contacto) { }

  ngOnInit() {
    this.cargando = true

    this.service.listarContacto(this.offset, this.limit).subscribe({
      next: (response) => {
        if (!Array.isArray(response)) {
          this.error = "Algo salio mal"
          this.cargando = false
          return
        }

        if (response.length === 0 && !this.isPagina) {
          this.error = "Aun no hay datos";
          this.cargando = false;
          return;
        }

        if (response.length === 0 && this.isPagina) {
          this.offset = 0;
          this.cargarContacto();
          return;
        }

       /* if (response.length == 0) {
          this.error = "Aun no hay datos"
          this.cargando = false
          return
        }*/

        this.listaContacto = response;
        this.listaContactoFiltrados = response; // Inicializar la lista filtrada con todos los mensajes
        this.cargando = false
      },
      error: (error) => {
        this.error = 'Error del servidor'
        console.log(error)
        this.cargando = false
      },
    })
  }

  cargarContacto() {
    this.cargando = true;

    this.service.listarContacto(this.offset, this.limit).subscribe({
      next: (response) => {
        if (!Array.isArray(response)) {
          this.error = "Algo salio mal";
          this.cargando = false;
          return;
        }

        if (response.length === 0 && this.offset > 0) {
          this.offset = 0;
          this.cargarContacto();
          return;
        }

        this.listaContacto = response;
        this.listaContactoFiltrados = [...response];
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
    this.cargarContacto();
  }

  anteriorPagina() {
    this.isPagina = true;
    if (this.offset <= 0) {
      this.offset = 0;
      return;
    }
    this.offset--;
    this.cargarContacto();
  }

  verContacto(contacto: ContactoI) {
    this.mensajeDetalles = contacto;
    this.showDetails = true;
  }

  cerrarDetalles() {
    this.showDetails = false;
    this.mensajeDetalles = null;
  }

  buscarMensajes() {
    if (!this.terminoBusqueda.trim()) {
      // Si no hay término de búsqueda, mostrar todos los mensajes
      this.listaContactoFiltrados = [...this.listaContacto];
    } else {
      // Filtrar los mensajes según el término de búsqueda
      const termino = this.terminoBusqueda.toLowerCase().trim();
      this.listaContactoFiltrados = this.listaContacto.filter(contacto =>
        contacto.nombre.toLowerCase().includes(termino) ||
        contacto.email.toLowerCase().includes(termino) ||
        contacto.servicio.toLowerCase().includes(termino) ||
        contacto.mensaje.toLowerCase().includes(termino)
      );
    }
  }

  mostrarEditarMensaje(contacto: ContactoI) {
    this.contactoEditando = contacto;
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.contactoEditando = null;
  }

  guardarMensaje() {
    if (this.contactoEditando) {
      this.editarcontacto(this.contactoEditando);
      this.cerrarModal();
    }
  }

  editarcontacto(contactoEditando: ContactoI) {
    this.service.editarcontacto(contactoEditando).subscribe({
      next: (response) => {
        console.log(response);
        // Actualizar la lista localmente
        const index = this.listaContacto.findIndex(c => c.idContacto === contactoEditando.idContacto);
        if (index !== -1) {
          this.listaContacto[index] = contactoEditando;
          this.listaContactoFiltrados = [...this.listaContacto]; // Actualizar la lista filtrada también
        }
      },
      error: (error) => {
        console.error('Error al modificar el mensaje:', error);
        this.error = 'Error al modificar el mensaje';
      }
    });
  }

  mostrarEliminarMensaje(eliminarContacto: ContactoI) {
    const confirmacion = confirm(`¿Estás seguro de eliminar el cliente con id ${eliminarContacto.idContacto}?`);
    if (confirmacion) {
      this.service.eliminarContacto(eliminarContacto).subscribe({
        next: (response) => {
          console.log(response);
          // Actualiza el arreglo local filtrando por id
          this.listaContacto = this.listaContacto.filter(c => c.idContacto !== eliminarContacto.idContacto);
          this.listaContactoFiltrados = [...this.listaContacto]; // Actualizar la lista filtrada también
        },
        error: (error) => {
          console.error('Error al eliminar el mensaje', error);
        }
      });
    }
  }

}
