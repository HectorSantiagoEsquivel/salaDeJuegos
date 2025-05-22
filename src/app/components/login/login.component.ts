import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { supabase } from '../../services/supabase';


@Component({
  standalone: true,
  imports: [FormsModule,CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  modo = true;
  sesionIniciada=false; 
  // Variables para login
  usuarioLogin: string = "";
  passwordLogin: string = "";
  
  // Variables para registro
  
  usuarioSingup: string = "";
  passwordSingup: string = "";
  confirmPassword: string = "";
  email: string = "";
  
  // Variables para el avatar (si decides usarlo)
  avatarFile: File | null = null;

  constructor(private router: Router) {}

  cambiarEstado() {
    this.modo = !this.modo;
  }

  login() {
    supabase.auth.signInWithPassword({
      email: this.usuarioLogin,
      password: this.passwordLogin,
    }).then(({ data, error }) => {
      if (error) {
        console.error('Error:', error.message);
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      this.sesionIniciada = false;
      this.modo = true; 
    }
  }

  
  async ngOnInit() {
    
    const { data: { session } } = await supabase.auth.getSession();
    this.sesionIniciada = !!session;
  }


  async register() {
    // Validación básica
    if (this.passwordSingup !== this.confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    try {
      // 1. Registrar usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: this.email,
        password: this.passwordSingup,
        options: {
          data: {
            username: this.usuarioSingup // Guardamos el nombre de usuario en metadata
          }
        }
      });

      if (authError) {
        console.error('Error en registro:', authError.message);
        return;
      }

      // 2. Si hay archivo de avatar, guardarlo
      let avatarUrl = null;
      if (this.avatarFile) {
        const uploadResult = await this.saveFile();
        if (uploadResult) {
          avatarUrl = uploadResult.path;
        }
      }

      // 3. Guardar datos adicionales en tabla 'users-data'
      if (authData.user) {
        const { error: dbError } = await supabase
          .from('usuarios')
          .insert([
            { 
              name: this.usuarioSingup, 
              email: this.email,
              avatarUrl: avatarUrl  
            }
          ]);

        if (dbError) {
          console.error('Error guardando datos:', dbError.message);
          return;
        }
      }

      console.log('Registro exitoso!');
      this.router.navigate(['/home']);
      
    } catch (error) {
      console.error('Error inesperado en registro:', error);
    }
  }

  private async saveFile() {
    if (!this.avatarFile) return null;

    const fileName = `users/${Date.now()}_${this.avatarFile.name}`;
    
    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(fileName, this.avatarFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error subiendo archivo:', error.message);
      return null;
    }

    return data;
  }

  onFileSelected(event: any) {
    this.avatarFile = event.target.files[0] || null;
  }
}