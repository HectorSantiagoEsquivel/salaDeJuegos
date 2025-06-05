import { Component } from '@angular/core';
import { PuntajeService } from '../../services/puntaje.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-puntaje',
  imports: [FormsModule,CommonModule],
  templateUrl: './puntaje.component.html',
  styleUrl: './puntaje.component.scss'
})
export class PuntajesComponent {


  ahorcado: any[] = [];
  mayormenor: any[] = [];
  preguntados: any[] = [];
  solitario: any[] = [];

  constructor(private puntajeService: PuntajeService) {}

  async ngOnInit() 
  {
    this.ahorcado = await this.puntajeService.obtenerPuntajesPorJuego('ahorcado', false);
    this.mayormenor = await this.puntajeService.obtenerPuntajesPorJuego('mayorOmenor', false);
    this.preguntados = await this.puntajeService.obtenerPuntajesPorJuego('preguntados', false);
    this.solitario = await this.puntajeService.obtenerPuntajesPorJuego('solitario', true);
  }
}
