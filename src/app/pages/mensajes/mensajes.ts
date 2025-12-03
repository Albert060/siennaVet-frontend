import { Component } from '@angular/core';
import { Contacto } from '../../services/contacto';
import { TableGenericComponent } from '../../components/table-generic/table-generic.component';
import { TableConfig } from '../../components/table-generic/table-generic.interface';

@Component({
  selector: 'app-mensajes',
  imports: [TableGenericComponent],
  templateUrl: './mensajes.html',
})
export class Mensajes {
  config: TableConfig = {
    title: 'Panel de Mensajes',
    subtitle: 'Gestión de mensajes de contacto en SiennaVet. Aquí puedes ver los registros de mensajes.',
    endpoint: 'https://siennavet-backend.onrender.com/api/contactos',
    enableCreation: false, // Deshabilitar creación para mensajes
    enableSearch: true,
    enablePagination: true,
    enableDetails: true,
    enableEdit: false, // Deshabilitar edición para mensajes
    enableDelete: false, // Mantener eliminación para mensajes
    itemsPerPage: 6,
    fields: [
      {
        key: 'idContacto',
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
        editable: false
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        display: true,
        searchable: true,
        editable: false
      },
      {
        key: 'servicio',
        label: 'Servicio',
        type: 'text',
        display: true,
        searchable: true,
        editable: false
      },
      {
        key: 'mensaje',
        label: 'Mensaje',
        type: 'text',
        display: true,
        searchable: true,
        editable: false
      }
    ]
  };

  constructor(public service: Contacto) { }
}
