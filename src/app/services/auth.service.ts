import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from './supabase';
import { UserData } from '../models/user-data';



@Injectable({
  providedIn: 'root'
})

export class AuthService {
  sesionIniciada = false;
  

  constructor(private router: Router) {}

  async login(email: string, password: string) {
    return supabase.auth.signInWithPassword({
      email: email,
      password: password,
    }).then(({ data, error }) => {
      if (error) {
        console.error('Error:', error.message);
      } else {
        this.router.navigate(['/home']);
      }
      return { data, error };
    });
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      this.sesionIniciada = false;
    }
    return { error };
  }

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    this.sesionIniciada = !!session;
    return { session };
  }

  async register(email: string, password: string, username: string, avatarFile: File | null) {
    if (!password) {
      console.error('La contraseña es requerida');
      return { error: { message: 'La contraseña es requerida' } };
    }

    try {
      // Registro en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username
          }
        }
      });

      if (authError) return { error: authError };

      // Manejo de avatar
      let avatar_url = null;
      if (avatarFile) {
        const uploadResult = await this.saveFile(avatarFile);
        if (uploadResult) {
          const { data: { publicUrl } } = await supabase
            .storage
            .from('images')
            .getPublicUrl(uploadResult.path);
          avatar_url = publicUrl;
        }
      }

      // Guardar en tabla usuarios
      if (authData.user) {
        const { error: dbError } = await supabase
          .from('usuarios')
          .insert([
            { 
              name: username, 
              email: email,
              avatar_url: avatar_url  
            }
          ]);

        if (dbError) return { error: dbError };
      }

      this.router.navigate(['/home']);
      return { data: authData };
      
    } catch (error) {
      console.error('Error inesperado en registro:', error);
      return { error: error as Error };
    }
  }

  private async saveFile(file: File) {
    const fileName = `users/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error subiendo archivo:', error.message);
      return null;
    }

    return data;
  }

async getUserDataByMail(email: string |undefined): Promise<{ data: any | null, error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)  
      .single();           

    if (error) throw error;

    return {
      data: data || null,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Error desconocido')
    };
  }
}

async getUserProfile(): Promise<UserData> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error('No hay usuario logueado');

    // Aquí está el cambio importante - añadir await y acceder a .data
    const { data: userData } = await this.getUserDataByMail(user.email);

    return {
      authId: userData?.authId || "0",
      name: userData?.name || user.email || 'Usuario',
      email: userData?.email || user.email || '',
      avatarUrl: userData?.avatar_url || 'assets/images/default-profile.png'
    };

  } catch (error) {
    console.error('Error cargando datos:', error);
    return {
      authId:-1,
      name: 'Error cargando datos',
      email: '',
      avatarUrl: 'assets/images/default-profile.png'
    };
  }
}
getCurrentUser() {
  return supabase.auth.getUser();
}
}