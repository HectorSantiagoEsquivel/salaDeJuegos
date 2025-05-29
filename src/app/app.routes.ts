import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { ChatComponent } from './components/chat/chat.component';
import { PreguntadosComponent } from './components/juegos/preguntados/preguntados.component';
import { AhorcadoComponent } from './components/juegos/ahorcado/ahorcado.component';


export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "about",
        component: AboutComponent
    },
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "chat",
        component: ChatComponent
    },
    // Add the new game routes
    {
        path: "preguntados",
        component: PreguntadosComponent
    },
    {
        path: "ahorcado",
        component: AhorcadoComponent
    }/*,
    {
        path: "mayoromenor",
        component: MayorOMenorComponent
    },
    {
        path: "evitalasespinas",
        component: EvitaLasEspinasComponent
    }*/
];