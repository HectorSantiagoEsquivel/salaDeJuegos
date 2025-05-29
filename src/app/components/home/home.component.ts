import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for common Angular directives
import { Router, RouterLink } from '@angular/router'; // Router for navigation

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule], // Import necessary modules for the template
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Define all four carousel items, ready for their respective games
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
    /*{
      id: 2,
      url: '../../../assets/FondoMayorOMenor.jpg',
      titulo: "Mayor O Menor",
      descripcion: "Un emocionante juego de cartas donde tu tarea es predecir si la siguiente carta será de mayor o menor valor que la actual. Es un juego rápido de riesgo y recompensa que requiere intuición y suerte. Acierta tantas veces seguidas como puedas para obtener el máximo puntaje.",
      route: '/mayoromenor' // Add the route for each game
    },*/
  ];

  // Keep track of the currently active item in the carousel
  activeItemsIndex: number = 0;

  constructor(private router: Router) {} // Inject the Router service for navigation

  /**
   * Sets the active item in the carousel based on the provided index.
   * @param slideIndex The index of the item to make active.
   */
  selectItem(slideIndex: number): void {
    this.activeItemsIndex = slideIndex;
  }

  /**
   * Gets the URL of the image for the currently active carousel item.
   * @returns The URL string.
   */
  getItemUrl(): string {
    return this.carrouselItems[this.activeItemsIndex].url;
  }

  /**
   * Gets the title of the currently active carousel item.
   * @returns The title string.
   */
  getItemTitle(): string {
    return this.carrouselItems[this.activeItemsIndex].titulo;
  }

  /**
   * Gets the description of the currently active carousel item.
   * @returns The description string.
   */
  getItemDes(): string {
    return this.carrouselItems[this.activeItemsIndex].descripcion;
  }

  /**
   * Navigates to the route of the currently selected game.
   * This method assumes user authentication is handled by route guards.
   */
  Jugar(): void {
    const selectedGameRoute = this.carrouselItems[this.activeItemsIndex].route;
    this.router.navigateByUrl(selectedGameRoute);
  }
}