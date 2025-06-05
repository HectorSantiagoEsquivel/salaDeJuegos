import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { K } from '@angular/cdk/keycodes';
import { PuntajeService } from '../../../services/puntaje.service';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent {
  palabras: string[] = [
    "Mariposa",
    "Teclado",
    "Volcan",
    "Robot",
    "Dinosaurio",
    "Maleta",
    "Sombrero",
    "Pintura",
    "Globo",
    "Camara",
    "Jirafa",
    "Canguro",
    "Hamburguesa",
    "Pizza",
    "Chocolate",
    "Espejo",
    "Ascensor",
    "Cohete",
    "Farola",
    "Guitarra",
    "Violin",
    "Piano",
    "Castillo",
    "Dragon",
    "Unicornio",
    "Faro",
    "Montaña",
    "Oceano",
    "Piramide",
    "Tesoro"
  ];
  
  keyboardRows = [
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
    ['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'],
    ['t', 'u', 'v', 'w', 'x', 'y', 'z']
  ];
  
  letras: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 
                     'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 
                     'u', 'v', 'w', 'x', 'y', 'z'];
  
  letrasHabilitadas: boolean[] = Array(this.letras.length).fill(true);
  letrasEncontradas: string[] = [];
  aciertos: number = 0;
  vidas: number = 6;
  palabraJugador: string = '';
  palabraAAdivinar: string = "";
  score: number = 0;

  establecerPalabraAleatoria(): string {
    const i = Math.floor(Math.random() * this.palabras.length);
    return this.palabras[i];
  }
  
  constructor(
    private puntajeService: PuntajeService,
    private router: Router
  ) {
    this.iniciarJuego();
    
  }

  iniciarJuego() {
    this.palabraAAdivinar = this.establecerPalabraAleatoria().toLowerCase();
    this.palabraJugador = '_'.repeat(this.palabraAAdivinar.length);
    this.letrasHabilitadas = Array(this.letras.length).fill(true);
    this.aciertos = 0;
    this.vidas = 6;
  }

  eligeLetra(letra: string) {
    if (!this.letrasHabilitadas[this.letras.indexOf(letra)]) return;

    if (!this.palabraAAdivinar.includes(letra)) {
      this.vidas--;
    }
    
    const palabraOcultaArreglo = this.palabraJugador.split('');
    const indice = this.letras.indexOf(letra);
    
    if (indice !== -1) {
      this.letrasHabilitadas[indice] = false;
    }

    for (let i = 0; i < this.palabraAAdivinar.length; i++) {
      if (this.palabraAAdivinar[i] === letra) {
        palabraOcultaArreglo[i] = letra;
        this.aciertos++;
      }
    }
    this.palabraJugador = palabraOcultaArreglo.join('');
    this.verificarResultado();
  }

  verificarResultado() {
    if (this.aciertos === this.palabraAAdivinar.length) {
      this.mostrarResultado(true);
    } else if (this.vidas === 0) {
      this.mostrarResultado(false);
    }
  }

  mostrarResultado(ganaste: boolean) {
    if(ganaste)
    {
      this.puntajeService.guardarPuntos("ahorcado",this.aciertos*this.vidas);
    }
    const titulo = ganaste ? '¡Ganaste!' : '¡Perdiste!';
    const mensaje = ganaste 
      ? `Adivinaste la palabra: ${this.palabraAAdivinar}`
      : `La palabra era: ${this.palabraAAdivinar}`;


      Swal.fire({
        icon: 'info',
        title: 'Juego Terminado',
        html: `
          <div style="font-size: 1.2rem; margin-bottom: 1rem;">
            ${mensaje}
            Tu puntuación: <strong>${this.aciertos*this.vidas}</strong>
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

  reiniciarJuego() {
    this.iniciarJuego();
  }

    volverAlHome() {
    this.router.navigateByUrl('/home');
  }
}