import { Component } from '@angular/core';
import { Cliente } from '../../services/cliente';
import { TableGenericComponent } from '../../components/table-generic/table-generic.component';
import { TableConfig } from '../../components/table-generic/table-generic.interface';

@Component({
  selector: 'app-clientes',
  imports: [TableGenericComponent],
  templateUrl: './clientes.html',
})
export class Clientes {
  config: TableConfig = {
    title: 'Panel de Clientes',
    subtitle: 'Gestión de clientes en SiennaVet. Aquí puedes ver, editar y eliminar los registros de clientes.',
    endpoint: 'http://localhost:8080/api/clientes',
    enableCreation: true,
    enableSearch: true,
    enablePagination: true,
    enableDetails: true,
    enableEdit: true,
    enableDelete: true,
    itemsPerPage: 6,
    fields: [
      {
        key: 'idCliente',
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
        key: 'apellido',
        label: 'Apellido',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'dni',
        label: 'DNI',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'direccion',
        label: 'Dirección',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'telefono',
        label: 'Teléfono',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'codigoPostal',
        label: 'Código Postal',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      }
    ]
  };

  constructor(public service: Cliente) { }
}
