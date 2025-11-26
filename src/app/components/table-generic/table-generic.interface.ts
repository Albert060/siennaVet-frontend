export interface TableData {
  id?: number | string; // Identificador único
  [key: string]: any; // Permite propiedades dinámicas
}

export interface TableFieldConfig {
  key: string;          // La clave del campo
  label: string;        // Etiqueta para mostrar
  type?: 'text' | 'email' | 'date' | 'select' | 'readonly' | 'time' | 'checkbox'; // Tipo de campo
  editable?: boolean;   // Si el campo es editable
  searchable?: boolean; // Si el campo es searchable
  display?: boolean;    // Si el campo se muestra en la tabla
  options?: { value: string | number; label: string }[]; // Opciones para campos select
  serviceIndex?: number;      // Índice del servicio adicional para opciones dinámicas
  serviceValueKey?: string;   // Clave del valor en el servicio adicional
  serviceLabelKey?: string;   // Clave de la etiqueta en el servicio adicional
}

export interface TableConfig {
  title: string;                        // Título de la sección
  subtitle: string;                     // Subtítulo descriptivo
  endpoint: string;                     // Endpoint para las operaciones CRUD
  fields: TableFieldConfig[];           // Configuración de los campos
  createFormTitle?: string;             // Título del formulario de creación
  editFormTitle?: string;               // Título del formulario de edición
  detailFormTitle?: string;             // Título del formulario de detalles
  enableCreation?: boolean;             // Habilitar/deshabilitar creación
  enableSearch?: boolean;               // Habilitar/deshabilitar búsqueda
  enablePagination?: boolean;           // Habilitar/deshabilitar paginación
  enableDetails?: boolean;              // Habilitar/deshabilitar vista de detalles
  enableEdit?: boolean;                 // Habilitar/deshabilitar edición
  enableDelete?: boolean;               // Habilitar/deshabilitar eliminación
  itemsPerPage?: number;                // Número de elementos por página
  additionalServices?: any[];           // Servicios adicionales para opciones dinámicas
}

export interface TableService {
  listar(offset?: number, limit?: number): any;
  crear?(data: any): any;
  editar?(data: any): any;
  eliminar?(data: any): any;
}
