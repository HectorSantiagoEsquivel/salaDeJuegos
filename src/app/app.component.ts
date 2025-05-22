import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { supabase } from './services/supabase';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, FormsModule, RouterLink], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isLoggedIn = false; 

  constructor(private router: Router) {
    this.checkAuthState();
  }

  async checkAuthState() {
    
    const { data: { session } } = await supabase.auth.getSession();
    this.isLoggedIn = !!session;
    
    
    supabase.auth.onAuthStateChange((_event, session) => {
      this.isLoggedIn = !!session;
    });
  }

  async logout() {
    await supabase.auth.signOut();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}