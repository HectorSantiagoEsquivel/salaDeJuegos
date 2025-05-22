import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { supabase } from '../../services/supabase';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userProfile: {
    name: string;
    email: string;
    avatarUrl: string;
  } = {
    name: 'Cargando...',
    email: '',
    avatarUrl: 'assets/images/default-profile.png'
  };

  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('No hay usuario logueado');

      const { data: userData } = await supabase
        .from('usuarios')
        .select('*')
        .then(response => {
          return {
            data: response.data?.find(u => u.email === user.email),
            error: null
          };
        });

      this.userProfile = {
        name: userData?.name || user.email || 'Usuario',
        email: userData?.email || user.email || '',
        avatarUrl: userData?.avatar_url || 'assets/images/default-profile.png'
      };

    } catch (error) {
      console.error('Error cargando datos:', error);
      this.userProfile = {
        name: 'Error cargando datos',
        email: '',
        avatarUrl: 'assets/images/default-profile.png'
      };
    }
  }
}