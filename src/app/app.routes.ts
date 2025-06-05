import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { ChatComponent } from './components/chat/chat.component';
import { PreguntadosComponent } from './components/juegos/preguntados/preguntados.component';
import { AhorcadoComponent } from './components/juegos/ahorcado/ahorcado.component';
import {GameComponent} from './solitaire/components/game/game.component'
import { MayorOMenorComponent } from './components/juegos/mayor-menor/mayor-menor.component';
import { PuntajesComponent } from './components/puntaje/puntaje.component';
import { EncuestaComponent } from './components/encuesta/encuesta.component';


export const routes: Routes = [
    {
        path: "login",
        loadComponent: () => import('./components/login/login.component').then(
            (m) => m.LoginComponent,
        ),
    },
    {
        path: "about",
        loadComponent: () => import('./components/about/about.component').then(
            (m) => m.AboutComponent,
        ),
    },
    {
        path: "home",
        loadComponent: () => import('./components/home/home.component').then(
            (m) => m.HomeComponent,
        ),
    },
    {
        path: "chat",
        loadComponent: () => import('./components/chat/chat.component').then(
            (m) => m.ChatComponent,
        ),
    },
    {
        path: "puntajes",
        loadComponent: () => import('./components/puntaje/puntaje.component').then(
            (m) => m.PuntajesComponent,
        ),
    },
    {
        path: "encuesta",
        loadComponent: () => import('./components/encuesta/encuesta.component').then(
            (m) => m.EncuestaComponent,
        ),
    },
    {
        path: "preguntados",
        loadComponent: () => import('./components/juegos/preguntados/preguntados.component').then(
            (m) => m.PreguntadosComponent,
        ),
    },
    {
        path: "ahorcado",
        loadComponent: () => import('./components/juegos/ahorcado/ahorcado.component').then(
            (m) => m.AhorcadoComponent,
        ),
    },
    {
        path: "solitario",
        loadComponent: () => import('./solitaire/components/game/game.component').then(
            (m) => m.GameComponent,
        ),
    },
    {
        path: "mayormenor",
        loadComponent: () => import('./components/juegos/mayor-menor/mayor-menor.component').then(
            (m) => m.MayorOMenorComponent,
        ),
    },
    {
        // Redirige la ruta vacía a 'home'
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        // Maneja cualquier ruta no encontrada, redirigiendo a 'home'
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];