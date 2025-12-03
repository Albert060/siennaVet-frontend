import { Component } from '@angular/core';
import { Ficha } from '../../services/ficha';
import { Raza } from '../../services/raza';
import { Cliente } from '../../services/cliente';
import { TableGenericComponent } from '../../components/table-generic/table-generic.component';
import { TableConfig } from '../../components/table-generic/table-generic.interface';

@Component({
  selector: 'app-dashboard',
  imports: [TableGenericComponent],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  config: TableConfig = {
    title: 'Panel de Control',
    subtitle: 'Bienvenido al panel de control de SiennaVet. Aquí puedes gestionar citas, veterinarios y otros aspectos del sistema.',
    endpoint: 'https://siennavet-backend.onrender.com/api/fichas',
    enableCreation: true,
    enableSearch: true,
    enablePagination: true,
    enableDetails: true,
    enableEdit: true,
    enableDelete: true,
    itemsPerPage: 6,
    additionalServices: [
      { service: null, serviceValueKey: 'idRaza', serviceLabelKey: 'nombre' }, // Placeholder para Raza
      { service: null, serviceValueKey: 'idCliente', serviceLabelKey: 'nombre' } // Placeholder para Cliente
    ],
    fields: [
      {
        key: 'idFicha',
        label: 'ID',
        type: 'readonly',
        display: true,
        searchable: false
      },
      {
        key: 'nombre',
        label: 'Nombre',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'sexo',
        label: 'Sexo',
        type: 'select',
        display: true,
        searchable: true,
        editable: true,
        options: [
          { value: 'Macho', label: 'Macho' },
          { value: 'Hembra', label: 'Hembra' }
        ]
      },
      {
        key: 'edad',
        label: 'Edad',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'peso',
        label: 'Peso',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'chip',
        label: 'Chip',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'idRaza',
        label: 'Raza',
        type: 'select',
        display: true,
        searchable: true,
        editable: true,
        serviceIndex: 0, // Usar el primer servicio adicional (Raza)
        serviceValueKey: 'idRaza',
        serviceLabelKey: 'nombre'
      },
      {
        key: 'idCliente',
        label: 'Cliente',
        type: 'select',
        display: true,
        searchable: true,
        editable: true,
        serviceIndex: 1, // Usar el segundo servicio adicional (Cliente)
        serviceValueKey: 'idCliente',
        serviceLabelKey: 'apellido'
      }
    ]
  };

  constructor(public service: Ficha, public razaService: Raza, public clienteService: Cliente) {
    // Asignar los servicios a la configuración
    // @ts-ignore
    this.config.additionalServices[0].service = this.razaService;
    // @ts-ignore
    this.config.additionalServices[1].service = this.clienteService;
  }
}
