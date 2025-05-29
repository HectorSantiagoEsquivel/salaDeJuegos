import { Injectable } from '@angular/core';
import { supabase } from './supabase';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

interface Message {
  authId: number;
  mensaje: string;
  fecha: string;
  idUsuario: number;
  usuarios?: { name: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _messages = new BehaviorSubject<Message[]>([]);
  private _isLoading = new BehaviorSubject<boolean>(true);
  private _currentUserData = new BehaviorSubject<any>(null);

  messages$ = this._messages.asObservable();
  currentUserData$ = this._currentUserData.asObservable();
  isLoading$ = this._isLoading.asObservable();

  constructor(private authService: AuthService) { }


  async loadInitialData(): Promise<void> {
    this._isLoading.next(true);
    

    try {

      const userProfile = await this.authService.getUserProfile();
      this._currentUserData.next(userProfile); 

      const { data, error } = await supabase
        .from('mensajes')
        .select(`
          authId, mensaje, fecha,
          idUsuario,
          usuarios:usuarios(name)
        `)
        .order('fecha', { ascending: false });

      if (error) throw error;

      this._messages.next(data as Message[]);
      this._isLoading.next(false);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      this._isLoading.next(false);
      // Aquí podrías implementar tu propio sistema de notificaciones
      throw error;
    }
  }

  async sendMessage(text: string): Promise<void> {
    if (!this._currentUserData || !text.trim()) return;

    try {
      const { error } = await supabase
        .from('mensajes')
        .insert({
          idUsuario: this._currentUserData.value?.authId,
          mensaje: text.trim()
        });

      if (error) throw error;

      // Recargar los mensajes después de enviar uno nuevo
      await this.loadInitialData();
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  }

  subscribeToNewMessages(callback: (message: Message) => void) {
    return supabase
      .channel('mensajes_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes'
        },
        (payload) => callback(payload.new as Message)
      )
      .subscribe();
  }

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

}