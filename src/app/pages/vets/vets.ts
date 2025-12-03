import { Component } from '@angular/core';
import { Veterinario } from '../../services/veterinario';
import { TableGenericComponent } from '../../components/table-generic/table-generic.component';
import { TableConfig } from '../../components/table-generic/table-generic.interface';

@Component({
  selector: 'app-vets',
  imports: [TableGenericComponent],
  templateUrl: './vets.html',
})
export class Vets {
  config: TableConfig = {
    title: 'Panel de Veterinarios',
    subtitle: 'Bienvenido al panel de veterinarios de SiennaVet. Aquí puedes gestionar la información de los veterinarios.',
    endpoint: 'https://siennavet-backend.onrender.com/api/veterinarios',
    enableCreation: true,
    enableSearch: true,
    enablePagination: true,
    enableDetails: true,
    enableEdit: true,
    enableDelete: true,
    itemsPerPage: 6,
    fields: [
      {
        key: 'idVet',
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
        key: 'sexo',
        label: 'Sexo',
        type: 'select',
        display: true,
        searchable: true,
        editable: true,
        options: [
          { value: 'Masculino', label: 'Masculino' },
          { value: 'Femenino', label: 'Femenino' },
          { value: 'Otro', label: 'Otro' }
        ]
      },
      {
        key: 'numColegiado',
        label: 'Núm Colegiado',
        type: 'text',
        display: true,
        searchable: true,
        editable: true
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
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
        key: 'fechaInicio',
        label: 'Fecha Inicio',
        type: 'date',
        display: true,
        searchable: true,
        editable: true
      }
    ]
  };

  constructor(public service: Veterinario) { }
}
