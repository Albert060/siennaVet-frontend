import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Ficha, FichaAnimales } from '../../services/ficha';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgIf],
  templateUrl: "./dashboard.html",
  styleUrls: ["./dashboard.css"]
})
  
export class Dashboard implements OnInit {
  public error: null | string = null;
  public listaFichas: FichaAnimales[] = [];
  public cargando: boolean = false;

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

  editarFicha(ficha: FichaAnimales) {
    // Lógica para editar la ficha
    console.log('Editar ficha:', ficha);
    // Aquí puedes redirigir a una página de edición o abrir un modal con el formulario
  }

  eliminarFicha(ficha: FichaAnimales) {
    // Lógica para eliminar la ficha
    console.log('Eliminar ficha:', ficha);
    // Aquí puedes mostrar un diálogo de confirmación y luego eliminar
  }
}
