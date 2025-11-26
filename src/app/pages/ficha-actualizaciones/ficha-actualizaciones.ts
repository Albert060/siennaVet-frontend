import { Component } from '@angular/core';
import { FichaActualizacionService } from '../../services/ficha-actualizacion';
import { Ficha } from '../../services/ficha';
import { Veterinario } from '../../services/veterinario';
import { TableGenericComponent } from '../../components/table-generic/table-generic.component';
import { TableConfig } from '../../components/table-generic/table-generic.interface';

@Component({
  selector: 'app-ficha-actualizaciones',
  imports: [TableGenericComponent],
  templateUrl: './ficha-actualizaciones.html',
})
export class FichaActualizaciones {
  config: TableConfig = {
    title: 'Actualizaciones de Fichas',
    subtitle: 'Gestiona las actualizaciones y registros de cada ficha veterinaria.',
    endpoint: 'http://localhost:8080/api/fichaActualizadas',
    enableCreation: true,
    enableSearch: true,
    enablePagination: true,
    enableDetails: true,
    enableEdit: true,
    enableDelete: true,
    itemsPerPage: 6,
    fields: [
      {
        key: 'idFichaActualizacion',
        label: 'ID Actualización',
        type: 'readonly',
        display: true,
        searchable: false
      },
      {
        key: 'comentario',
        label: 'Comentario',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'fecha',
        label: 'Fecha',
        type: 'date',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'hora',
        label: 'Hora',
        type: 'time',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'esUrgencia',
        label: 'Urgencia',
        type: 'checkbox',
        display: true,
        searchable: true,
        editable: false,
      },
      {
        key: 'costo',
        label: 'Costo',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'formaPago',
        label: 'Forma de Pago',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'idFicha',
        label: 'Ficha',
        type: 'select',
        display: true,
        searchable: true,
        editable: true,
        serviceIndex: 0, // Usar el primer servicio adicional (Ficha)
        serviceValueKey: 'idFicha',
        serviceLabelKey: 'nombre'
      },
      {
        key: 'idVet',
        label: 'Veterinario',
        type: 'select',
        display: true,
        searchable: true,
        editable: true,
        serviceIndex: 1, // Usar el segundo servicio adicional (Veterinario)
        serviceValueKey: 'idVet',
        serviceLabelKey: 'nombre'
      }
    ]
  };

  constructor(
    public service: FichaActualizacionService,
    public fichaService: Ficha,
    public vetService: Veterinario
  ) {
    // Asignar los servicios adicionales a la configuración
    this.config.additionalServices = [
      { service: this.fichaService, serviceValueKey: 'idFicha', serviceLabelKey: 'nombre' },
      { service: this.vetService, serviceValueKey: 'idVet', serviceLabelKey: 'nombre' }
    ];
  }
}
