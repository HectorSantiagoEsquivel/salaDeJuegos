import { Injectable } from '@angular/core';
import { supabase } from './supabase';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PuntajeService {
  private _currentUserData = new BehaviorSubject<any>(null);
  currentUserData$ = this._currentUserData.asObservable();

  constructor(private authService: AuthService) { }

async obtenerPuntajesPorJuego(
  juego: string,
  ascendente: boolean = true  // true para solitario, false para otros
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('puntajes')
      .select(`
        id,
        puntos,
        created_at,
        juego,
        usuario:usuarios(name)
      `)
      .eq('juego', juego)
      .order('puntos', { ascending: ascendente })  // true=asc, false=desc
      .order('created_at', { ascending: false });         // Siempre más recientes primero

    if (error) throw error;

    return data.map(item => ({
      ...item,
      fechaFormateada: this.formatDate(item.created_at),
      puntos: Number(item.puntos)
    }));

  } catch (error) {
    console.error('Error al obtener puntajes:', error);
    throw error;
  }
}

  
  private formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

    async guardarPuntos(juego: string, puntaje: number): Promise<void> {

      const userProfile = await this.authService.getUserProfile();
      this._currentUserData.next(userProfile); 

      if (!this._currentUserData.value || !juego.trim() || isNaN(puntaje)) return; // Access .value for BehaviorSubject
  
      try {
        const { error } = await supabase
          .from('puntajes')
          .insert({
            id_usuario: this._currentUserData.value?.authId,
            puntos:puntaje,
            juego: juego.trim()
          });
  
        if (error) throw error;
  
      } catch (error) {
        console.error('Error al guardar puntos:', error);
        throw error;
      }
    }
  
}
