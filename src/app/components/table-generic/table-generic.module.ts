import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableGenericComponent } from './table-generic.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    TableGenericComponent
  ],
  exports: [
    TableGenericComponent
  ]
})
export class TableGenericModule { }