import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterLink } from '@angular/router'; 


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  carrouselItems = [
    {
      id: 0,
      url: '../../../assets/images/preguntados.png',
      titulo: "Preguntados",
      descripcion: "¿Podrás adivinar de qué Pokémon se trata solo viendo su silueta? Demostrá tu memoria y conocimiento de la Pokédex en este desafío inspirado en el clásico segmento del anime.",
      route: '/preguntados' // Add the route for each game
    },
    {
      id: 1,
      url: '../../../assets/images/ahorcado.png',
      titulo: "Ahorcado",
      descripcion: "El clásico juego de las letras donde tenés que adivinar una palabra oculta, eligiendo una letra por vez.",
      route: '/ahorcado' // Add the route for each game
    },
    {
      id: 2,
      url: '../../../assets/images/solitario.png', // Add solitaire image
      titulo: "Solitario",
      descripcion: "El clásico juego de cartas. Ordená las cartas por palo y número para ganar.",
      route: '/solitario'
    },
    {
      id: 3,
      url: '../../../assets/images/mayormenor.png', // Add solitaire image
      titulo: "Mayor o Menor",
      descripcion: "Demostra tu suerte y memoria en este juego de cartas",
      route: '/mayormenor'
    }
  ];

  
  activeItemsIndex: number = 0;

  constructor(private router: Router) {} 


  selectItem(slideIndex: number): void {
    this.activeItemsIndex = slideIndex;
  }


  getItemUrl(): string {
    return this.carrouselItems[this.activeItemsIndex].url;
  }


  getItemTitle(): string {
    return this.carrouselItems[this.activeItemsIndex].titulo;
  }


  getItemDes(): string {
    return this.carrouselItems[this.activeItemsIndex].descripcion;
  }


  Jugar(): void {
    const selectedGameRoute = this.carrouselItems[this.activeItemsIndex].route;
    this.router.navigateByUrl(selectedGameRoute);
  }
}