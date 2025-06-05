import { Component } from '@angular/core';
import { PreguntadosService } from '../../../services/preguntados.service';
import { Router } from '@angular/router';
import { Pokemon } from '../../../interfaces/pokemon';
import { PuntajeService } from '../../../services/puntaje.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.scss'
})
export class PreguntadosComponent {
  pokemonCorrecto!: Pokemon | undefined;
  pokemon!: Pokemon[] | undefined;
  opcionUno!: string;
  opcionDos!: string;
  opcionTres!: string;
  opcionCuatro!: string;
  score: number = 0;
  tiempoRestante: number = 10;
  tiempoTerminado: boolean = false;
  intervalId: any;
  mostrarImagen = false;

  constructor(
    private preguntadosServ: PreguntadosService,
    private puntajeService: PuntajeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarJuego();
    this.iniciarContador();
  }

  inicializarJuego(): void {
    this.mostrarImagen = false;
    this.preguntadosServ.obtenerPokemon().subscribe(
      (response) => {
        this.pokemonCorrecto = response;

        this.preguntadosServ.obtenerOpcionesPokemon().subscribe(
          (response) => {
            this.pokemon = response;
            this.seleccionarOpciones();
          }
        )
      }
    )
  }

  iniciarContador() {
    this.intervalId = setInterval(() => {
      this.tiempoRestante -= 1;

      if (this.tiempoRestante === 0) {
        clearInterval(this.intervalId);
        this.tiempoRestante = 0;
        this.verificarTiempo();
      }
    }, 1000);
  }
  

  detenerContador() {
    clearInterval(this.intervalId);
  }

  seleccionarOpciones(): void {
    const opcionesFiltradas = this.pokemon!.filter(per => per.id !== this.pokemonCorrecto?.id);
    const opcionesSeleccionadas = [];
    const indicesSeleccionados = new Set();

    while (opcionesSeleccionadas.length < 3) {
      const randomIndex = Math.floor(Math.random() * opcionesFiltradas.length);

      if (!indicesSeleccionados.has(randomIndex)) {
        opcionesSeleccionadas.push(opcionesFiltradas[randomIndex]);
        indicesSeleccionados.add(randomIndex);
      }
    }

    opcionesSeleccionadas.push(this.pokemonCorrecto);
    opcionesSeleccionadas.sort(() => 0.5 - Math.random());

    this.opcionUno = opcionesSeleccionadas[0]!.name;
    this.opcionDos = opcionesSeleccionadas[1]!.name;
    this.opcionTres = opcionesSeleccionadas[2]!.name;
    this.opcionCuatro = opcionesSeleccionadas[3]!.name;
  }

  verificarTiempo() {
    if (this.tiempoRestante === 0) 
    {
      this.finalizarJuego();
      return true;
    }
    return false;
  }

    finalizarJuego() {
      this.detenerContador();
      this.puntajeService.guardarPuntos("preguntados", this.score);

      Swal.fire({
        icon: 'info',
        title: 'Juego Terminado',
        html: `
          <div style="font-size: 1.2rem; margin-bottom: 1rem;">
            Tu puntuación: <strong>${this.score}</strong>
          </div>
          <div>¿Qué te gustaría hacer ahora?</div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Jugar de Nuevo',
        cancelButtonText: 'Volver al Menú',
        reverseButtons: true,
        backdrop: true,
        allowOutsideClick: false,
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title'
        }
      }).then((r) => {
        if (r.isConfirmed) {
          this.reiniciarJuego();
        } else if (r.dismiss === Swal.DismissReason.cancel) {
          this.volverAlHome();
        }
      });
    }

verificarRespuesta(opcionObtenida: string): void {
  if (opcionObtenida === this.pokemonCorrecto?.name) {
    this.mostrarImagen = true; // Revela el sprite
    this.detenerContador();    // Pausa el timer

    setTimeout(() => {
      this.score++;
      this.mostrarImagen = false;     // Oculta sprite para la próxima ronda
      this.tiempoRestante++;
      this.inicializarJuego();        // Carga nueva pregunta
      this.iniciarContador();         // Reinicia timer
    }, 1000); // Espera 1 segundo mostrando el sprite
  } else 
  {
    this.finalizarJuego();
  }

  /*if (this.score === 10) {
    this.detenerContador();
    Swal.fire({
      icon: 'success',
      title: 'Ganaste',
      showCancelButton: true,
      confirmButtonText: 'Reiniciar',
      cancelButtonText: 'Volver al Menú',
      reverseButtons: true,
      backdrop: true,
      allowOutsideClick: false,
    }).then((r) => {
      if (r.isConfirmed) {
        this.reiniciarJuego();
      } else if (r.dismiss === Swal.DismissReason.cancel) {
        this.volverAlHome();
      }
    });
  }*/
}



  actualizarImagen(): any {
    return this.pokemonCorrecto?.sprites.front_default;
  }

  reiniciarJuego(): void {
    window.location.reload();
  }

  volverAlHome() {
    this.router.navigateByUrl('/home');
  }

  ngOnDestroy() {
    this.detenerContador();
  }
}