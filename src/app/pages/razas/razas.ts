import { Component } from '@angular/core';
import { Raza } from '../../services/raza';
import { TableGenericComponent } from '../../components/table-generic/table-generic.component';
import { TableConfig } from '../../components/table-generic/table-generic.interface';

@Component({
  selector: 'app-razas',
  imports: [TableGenericComponent],
  templateUrl: './razas.html',
})
export class Razas {
  config: TableConfig = {
    title: 'Panel de Razas',
    subtitle: 'Gestión de razas en SiennaVet. Aquí puedes ver, editar y eliminar los registros de razas.',
    endpoint: 'http://localhost:8080/api/razas',
    enableCreation: true,
    enableSearch: true,
    enablePagination: true,
    enableDetails: true,
    enableEdit: true,
    enableDelete: true,
    itemsPerPage: 6,
    fields: [
      {
        key: 'idRaza',
        label: 'ID',
        type: 'readonly',
        display: true,
        searchable: false
      },
      {
        key: 'tipoRaza',
        label: 'Tipo Raza',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'nombre',
        label: 'Nombre Raza',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      }
    ]
  };

  constructor(public service: Raza) {
  }
}
