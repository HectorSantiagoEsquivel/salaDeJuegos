import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  modo = true;
  
  usuarioLogin: string = "";
  passwordLogin: string = "";
  
  usuarioSingup: string = "";
  passwordSingup: string = "";
  confirmPassword: string = "";
  email: string = "";
  
  avatarFile: File | null = null;
  errorMessage: string | null = null; // Added error message property

  constructor(private router: Router, private authService: AuthService) {}

  cambiarEstado() {
    this.modo = !this.modo;
    this.errorMessage = null; // Clear error when switching modes
  }

  async login(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation(); // Añade esto para mayor seguridad
    this.errorMessage = null;
    
    try {
      const { data, error } = await this.authService.login(this.usuarioLogin, this.passwordLogin);
      
      if (error) {
        this.errorMessage = 'Email o contraseña incorrectos';
        // Forzar la detección de cambios (solución adicional)
        setTimeout(() => {}, 0);
      } else if (data?.user) {
        this.router.navigate(['/home']);
      }
    } catch (error) {
      this.errorMessage = 'Error al conectar con el servidor';
      console.error('Login exception:', error);
    }
  }

  logout() {
    this.authService.logout().then(() => {
      this.modo = true;
    });
  }

  async ngOnInit() {
    await this.authService.getSession();
  }

  fillQuickAccess(): void {
    this.usuarioLogin = 'tester@tester.com'; 
    this.passwordLogin = 'tester';           
  }

  register() {
    if (this.passwordSingup !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden'; // Set error message in Spanish
      return;
    }
    this.errorMessage = null; // Reset error message
    this.authService.register(
      this.email,
      this.passwordSingup,
      this.usuarioSingup,
      this.avatarFile
    );
  }

  onFileSelected(event: any) {
    this.avatarFile = event.target.files[0] || null;
  }
}