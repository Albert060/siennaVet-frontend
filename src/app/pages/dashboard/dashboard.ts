import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ficha, FichaAnimales } from '../../services/ficha';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: "./dashboard.html",
  styleUrls: ["./dashboard.css"]
})
  
export class Dashboard implements OnInit {
  public error: null | string = null;
  public listaFichas: FichaAnimales[] = [];
  public cargando: boolean = false;
  public showModal: boolean = false;
  public fichaEditando: FichaAnimales | null = null;

  constructor(private service: Ficha) { }

  ngOnInit() {
    this.cargando = true

    this.service.listarFicha().subscribe({
      next: (response) => {
        if (!Array.isArray(response)) {
          this.error = "Algo salio mal"
          this.cargando = false
          return
        }

        if (response.length == 0) {
          this.error = "Aun no hay datos"
          this.cargando = false
          return
        }

        this.listaFichas = response;
        this.cargando = false
      },
      error: (error) => {
        this.error = 'Error del servidor'
        console.log(error)
        this.cargando = false
      },
    })
  }

  verFicha(ficha: FichaAnimales) {
    // Lógica para ver la ficha
    console.log('Ver ficha:', ficha);
    // Aquí puedes redirigir a una página de detalle o abrir un modal
  }

  mostrarEditarFicha(ficha: FichaAnimales) {
    this.fichaEditando = ficha;
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.fichaEditando = null;
  }

  guardarFicha() {
    if (this.fichaEditando) {
      this.editarFicha(this.fichaEditando);
      this.cerrarModal();
    }
  }

  editarFicha(fichaEditada: FichaAnimales) {
    this.service.editarFicha(fichaEditada).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error('Error al editar la ficha:', error);
        this.error = 'Error al editar la ficha';
      }
    });
  }

  mostrarEliminarFicha(ficha: FichaAnimales) {
    // Lógica para eliminar la ficha
    console.log('Eliminar ficha:', ficha);
    // Aquí puedes mostrar un diálogo de confirmación y luego eliminar
  }
}
