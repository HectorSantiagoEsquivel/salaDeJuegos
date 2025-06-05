import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { supabase } from '../../services/supabase';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.scss'
})
export class EncuestaComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  userEmail: string | null = null;
  userName: string | null = null;
  userId: number=0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // Obtener datos del usuario actual
    const { data: { user } } = await this.authService.getCurrentUser();
    this.userEmail = user?.email || null;
    
    // Obtener perfil completo si existe
    if (this.userEmail) {
      const userProfile = await this.authService.getUserProfile();
      this.userName = userProfile.name;
      this.userId=userProfile.authId;
    }

    this.initializeForm();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.pattern('^[a-zA-Z]+$'), Validators.required]],
      apellido: ['', [Validators.pattern('^[a-zA-Z]+$'), Validators.required]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(10), Validators.required]],
      juegoFavorito: ['preguntados', Validators.required],
      puntaje: [5, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

    get nombre() {
    return this.form.get('nombre');
  }

  get apellido() {
    return this.form.get('apellido');
  }

  get edad() {
    return this.form.get('edad');
  }

  get telefono() {
    return this.form.get('telefono');
  }

  async enviarForm(): Promise<void> {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    try {
      const encuestaData = {
        fecha: new Date().toISOString(),
        email: this.userEmail,
        nombre: this.form.value.nombre,
        apellido: this.form.value.apellido,
        edad: this.form.value.edad,
        telefono: this.form.value.telefono,
        juego_favorito: this.form.value.juegoFavorito,
        puntaje: this.form.value.puntaje,
        user_id: this.userId // ID de Supabase Auth
      };

      const { data, error } = await supabase
        .from('encuestas')
        .insert(encuestaData)
        .select();

      if (error) throw error;

      this.showSuccessAlert();

    } catch (error) {
      console.error('Error al guardar encuesta:', error);
      this.showErrorAlert();
    }
  }

  private showSuccessAlert(): void {
    Swal.fire({
      icon: 'success',
      title: 'Encuesta enviada con éxito',
      showCancelButton: true,
      confirmButtonText: 'Otra encuesta',
      cancelButtonText: 'Volver al Menu',
      reverseButtons: true,
      backdrop: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.reiniciarPagina();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.volverAlHome();
      }
    });
  }

  private showErrorAlert(): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo enviar la encuesta. Por favor intenta nuevamente.'
    });
  }

  reiniciarPagina(): void {
    window.location.reload();
  }

  volverAlHome(): void {
    this.router.navigate(['/home']);
  }
}