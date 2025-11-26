import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableConfig, TableData, TableFieldConfig } from './table-generic.interface';

@Component({
  selector: 'app-table-generic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-generic.component.html',
  styleUrls: ['./table-generic.component.css']
})
export class TableGenericComponent implements OnInit {
  @Input() config!: TableConfig;
  @Input() service: any; // Servicio inyectado para las operaciones CRUD
  @Input() additionalServices: any[] = []; // Servicios adicionales para opciones dinámicas

  public error: null | string = null;
  public listaDatos: TableData[] = [];
  public listaDatosFiltrados: TableData[] = [];
  public cargando: boolean = false;
  public showModal: boolean = false;
  public showDetails: boolean = false;
  public terminoBusqueda: string = '';
  public itemEditando: TableData | null = null;
  public itemDetalles: TableData | null = null;
  public eliminarItem: TableData | null = null;
  public offset = 0;
  public limit = 6;
  public isPagina: boolean = false;
  public esCreacion: boolean = false; // Para distinguir entre creación y edición

  @Output() onItemCreated = new EventEmitter<TableData>();
  @Output() onItemUpdated = new EventEmitter<TableData>();
  @Output() onItemDeleted = new EventEmitter<TableData>();

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    // Configurar el límite por página desde la configuración
    if (this.config.itemsPerPage) {
      this.limit = this.config.itemsPerPage;
    }

    // Cargar opciones dinámicas si existen servicios adicionales
    this.cargarOpcionesDinamicas();

    this.cargarDatos();
  }

  cargarOpcionesDinamicas() {
    // Verificar si el config tiene additionalServices
    if (this.config.additionalServices && this.config.additionalServices.length > 0) {
      // Asignar los servicios adicionales recibidos como input si no están en la configuración
      if (!this.config.additionalServices.length && this.additionalServices.length > 0) {
        this.config.additionalServices = this.additionalServices;
      }

      // Procesar cada servicio adicional
      this.config.additionalServices.forEach((servicioData, index) => {
        if (servicioData && servicioData.service && typeof servicioData.service.listar === 'function') {
          servicioData.service.listar().subscribe({
            next: (response: any[]) => {
              // Actualizar las opciones para los campos que usan este servicio
              this.config.fields.forEach(field => {
                if (field.serviceIndex === index) {
                  field.options = response.map(item => ({
                    value: item[field.serviceValueKey || 'id'],
                    label: item[field.serviceLabelKey || 'nombre']
                  }));
                }
              });
            },
            error: (error: any) => {
              console.error('Error al cargar opciones dinámicas:', error);
            }
          });
        }
      });
    }
  }

  cargarDatos() {
    this.cargando = true;

    // Detectar si el servicio tiene un método listar o usar HttpClient directamente
    if (this.service && typeof this.service.listar === 'function') {
      this.service.listar(this.offset, this.limit).subscribe({
        next: (response: any) => {
          this.procesarDatosCargados(response);
        },
        error: (error: any) => {
          this.error = 'Error del servidor';
          console.log(error);
          this.cargando = false;
        }
      });
    } else {
      // Si no hay servicio definido, usar HttpClient directamente con el endpoint
      this.http.get<TableData[]>(`${this.config.endpoint}?offset=${this.offset}&limit=${this.limit}`).subscribe({
        next: (response: any) => {
          this.procesarDatosCargados(response);
        },
        error: (error) => {
          this.error = 'Error del servidor';
          console.log(error);
          this.cargando = false;
        }
      });
    }
  }

  private procesarDatosCargados(response: any) {
    if (!Array.isArray(response)) {
      this.error = "Algo salió mal";
      this.cargando = false;
      return;
    }

    if (response.length === 0 && !this.isPagina) {
      this.error = "Aún no hay datos";
      this.cargando = false;
      return;
    }

    if (response.length === 0 && this.isPagina) {
      this.offset = 0;
      this.cargarDatos();
      return;
    }

    this.listaDatos = response;
    this.listaDatosFiltrados = [...response];
    this.cargando = false;
  }

  siguientePagina() {
    this.isPagina = true;
    this.offset++;
    this.cargarDatos();
  }

  anteriorPagina() {
    this.isPagina = true;
    if (this.offset <= 0) {
      this.offset = 0;
      return;
    }
    this.offset--;
    this.cargarDatos();
  }

  verItem(item: TableData) {
    if (!this.config.enableDetails) return;
    this.itemDetalles = item;
    this.showDetails = true;
  }

  cerrarDetalles() {
    this.showDetails = false;
    this.itemDetalles = null;
  }

  buscar() {
    if (!this.config.enableSearch) return;

    if (!this.terminoBusqueda.trim()) {
      // Si no hay término de búsqueda, mostrar todos los datos
      this.listaDatosFiltrados = [...this.listaDatos];
    } else {
      // Filtrar los datos según el término de búsqueda
      const termino = this.terminoBusqueda.toLowerCase().trim();
      this.listaDatosFiltrados = this.listaDatos.filter(item => {
        return this.config.fields.some(field => {
          if (field.searchable !== false) { // Por defecto, si no se especifica searchable, se asume true
            const fieldValue = item[field.key]?.toString().toLowerCase();
            return fieldValue && fieldValue.includes(termino);
          }
          return false;
        });
      });
    }
  }

  crearNuevo() {
    if (!this.config.enableCreation) return;

    this.esCreacion = true;
    // Crear un objeto vacío con las propiedades configuradas
    this.itemEditando = {};
    this.config.fields.forEach(field => {
      if (field.type === 'select' && field.options && field.options.length > 0) {
        this.itemEditando![field.key] = field.options[0].value;
      } else {
        this.itemEditando![field.key] = '';
      }
    });
    this.showModal = true;
  }

  mostrarEditarItem(item: TableData) {
    if (!this.config.enableEdit) return;

    this.esCreacion = false;
    this.itemEditando = { ...item }; // Crear copia para evitar modificar el original accidentalmente
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.itemEditando = null;
  }

  guardarItem() {
    if (this.itemEditando) {
      if (this.esCreacion) {
        this.crearItem(this.itemEditando);
      } else {
        this.editarItem(this.itemEditando);
      }
      this.cerrarModal();
    }
  }

  crearItem(nuevoItem: TableData) {
    if (this.service && typeof this.service.crear === 'function') {
      this.service.crear(nuevoItem).subscribe({
        next: (response: any) => {
          console.log('Item creado:', response);
          // Agregar el nuevo item a la lista
          this.listaDatos.push(response);
          this.listaDatosFiltrados.push(response);
          this.onItemCreated.emit(response);
        },
        error: (error: any) => {
          console.error('Error al crear el item:', error);
          this.error = 'Error al crear el item';
        }
      });
    } else {
      // Si no hay servicio definido, usar HttpClient directamente con el endpoint
      this.http.post<TableData>(this.config.endpoint, nuevoItem).subscribe({
        next: (response: any) => {
          console.log('Item creado:', response);
          // Agregar el nuevo item a la lista
          this.listaDatos.push(response);
          this.listaDatosFiltrados.push(response);
          this.onItemCreated.emit(response);
        },
        error: (error) => {
          console.error('Error al crear el item:', error);
          this.error = 'Error al crear el item';
        }
      });
    }
  }

  editarItem(itemEditado: TableData) {
    if (this.service && typeof this.service.editar === 'function') {
      this.service.editar(itemEditado).subscribe({
        next: (response: any) => {
          console.log(response);
          // Actualizar la lista localmente
          const index = this.listaDatos.findIndex(item => this.getId(item) === this.getId(itemEditado));
          if (index !== -1) {
            this.listaDatos[index] = response;
            // Actualizar también la lista filtrada
            const indexFiltrado = this.listaDatosFiltrados.findIndex(item => this.getId(item) === this.getId(itemEditado));
            if (indexFiltrado !== -1) {
              this.listaDatosFiltrados[indexFiltrado] = response;
            }
          }
          this.onItemUpdated.emit(response);
        },
        error: (error: any) => {
          console.error('Error al modificar el item:', error);
          this.error = 'Error al modificar el item';
        }
      });
    } else {
      // Si no hay servicio definido, usar HttpClient directamente con el endpoint
      this.http.put<TableData>(this.config.endpoint, itemEditado).subscribe({
        next: (response: any) => {
          console.log(response);
          // Actualizar la lista localmente
          const index = this.listaDatos.findIndex(item => this.getId(item) === this.getId(itemEditado));
          if (index !== -1) {
            this.listaDatos[index] = response;
            // Actualizar también la lista filtrada
            const indexFiltrado = this.listaDatosFiltrados.findIndex(item => this.getId(item) === this.getId(itemEditado));
            if (indexFiltrado !== -1) {
              this.listaDatosFiltrados[indexFiltrado] = response;
            }
          }
          this.onItemUpdated.emit(response);
        },
        error: (error) => {
          console.error('Error al modificar el item:', error);
          this.error = 'Error al modificar el item';
        }
      });
    }
  }

  mostrarEliminarItem(eliminarItem: TableData) {
    if (!this.config.enableDelete) return;

    const confirmacion = confirm(`¿Estás seguro de eliminar el item con id ${this.getId(eliminarItem)}?`);
    if (confirmacion) {
      if (this.service && typeof this.service.eliminar === 'function') {
        this.service.eliminar(eliminarItem).subscribe({
          next: (response: any) => {
            console.log(response);
            // Actualiza el arreglo local filtrando por id
            this.listaDatos = this.listaDatos.filter(item => this.getId(item) !== this.getId(eliminarItem));
            this.listaDatosFiltrados = this.listaDatosFiltrados.filter(item => this.getId(item) !== this.getId(eliminarItem));
            this.onItemDeleted.emit(response);
          },
          error: (error: any) => {
            console.error('Error al eliminar el item', error);
          }
        });
      } else {
        // Si no hay servicio definido, usar HttpClient directamente con el endpoint
        const id = this.getId(eliminarItem);
        this.http.delete<TableData>(`${this.config.endpoint}/${id}`).subscribe({
          next: (response: any) => {
            console.log(response);
            // Actualiza el arreglo local filtrando por id
            this.listaDatos = this.listaDatos.filter(item => this.getId(item) !== id);
            this.listaDatosFiltrados = this.listaDatosFiltrados.filter(item => this.getId(item) !== id);
            this.onItemDeleted.emit(response);
          },
          error: (error) => {
            console.error('Error al eliminar el item', error);
          }
        });
      }
    }
  }

  // Método auxiliar para obtener el ID de un item
  private getId(item: TableData): number | string {
    // Buscar un campo que se llame 'id', 'idCliente', 'idVet', 'idRaza', 'idFicha', 'idContacto', etc.
    const idFields = ['id', 'idCliente', 'idVet', 'idRaza', 'idFicha', 'idContacto'];
    for (const field of idFields) {
      if (item.hasOwnProperty(field)) {
        return item[field];
      }
    }
    // Si no se encuentra un campo ID estándar, usar 'id' por defecto
    return item['id'] || 0;
  }

  // Método para obtener el valor de un campo
  getFieldValue(item: TableData, field: TableFieldConfig): any {
    console.log(item)
    console.log(field)
    console.log(item[field.key])
    return item[field.key];
  }

  // Método para determinar si un campo es editable
  isFieldEditable(field: TableFieldConfig): boolean {
    return field.editable !== false; // Por defecto, si no se especifica editable, se asume true
  }

  // Método para determinar si un campo es searchable
  isFieldSearchable(field: TableFieldConfig): boolean {
    return field.searchable !== false; // Por defecto, si no se especifica searchable, se asume true
  }

  // Método para determinar si un campo se debe mostrar
  isFieldVisible(field: TableFieldConfig): boolean {
    return field.display !== false; // Por defecto, si no se especifica display, se asume true
  }
}
