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
  
  // Variables para login
  usuarioLogin: string = "";
  passwordLogin: string = "";
  
  // Variables para registro
  usuarioSingup: string = "";
  passwordSingup: string = "";
  confirmPassword: string = "";
  email: string = "";
  
  // Variables para el avatar
  avatarFile: File | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  cambiarEstado() {
    this.modo = !this.modo;
  }

  login() {
    this.authService.login(this.usuarioLogin, this.passwordLogin);
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
    this.usuarioLogin = 'tester@tester.com'; // Auto-fill email
    this.passwordLogin = 'tester';           // Auto-fill password
  }

  register() {
    if (this.passwordSingup !== this.confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return;
    }
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