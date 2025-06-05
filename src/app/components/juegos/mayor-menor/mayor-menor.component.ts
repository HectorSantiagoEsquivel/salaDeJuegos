import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DeckService } from '../../../solitaire/services/deck/deck.service';
import { Card } from '../../../solitaire/types';
import { CardComponent } from '../../../solitaire/components/card/card.component';
import { PuntajeService } from '../../../services/puntaje.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mayor-o-menor',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MayorOMenorComponent implements OnInit {
  isBrowser: boolean = false;
  deck: Card[] = [];
  currentCard: Card | undefined = undefined;
  nextCard: Card | null = null;
  score: number = 0;
  gameStarted: boolean = false;
  gameOver: boolean = false;
  message: string = '';
  showNextCard: boolean = false;
  
  constructor(
    private deckService: DeckService,
    private changeDetectorRef: ChangeDetectorRef,
    private puntajeService:PuntajeService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: string,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initializeGame();
    }
  }

  initializeGame(): void {
    // Generate a single deck of 52 cards (standard deck)
    this.deck = this.deckService.generateDeck('spade', 'black', 13)
      .concat(this.deckService.generateDeck('heart', 'red', 13))
      .concat(this.deckService.generateDeck('diamond', 'red', 13))
      .concat(this.deckService.generateDeck('club', 'black', 13));
    
    this.deck = this.deckService.shuffle(this.deck);
    this.score = 0;
    this.gameStarted = false;
    this.gameOver = false;
    this.showNextCard = false;
    this.message = 'Press "Start Game" to begin';
    this.changeDetectorRef.detectChanges();
  }

  startGame(): void {
    if (this.deck.length < 2) {
      this.message = 'Not enough cards in the deck';
      return;
    }
    
    this.gameStarted = true;
    this.gameOver = false;
    this.currentCard = this.deck.pop()!;
    this.nextCard = null;
    this.showNextCard = false;
    this.message = `La carta actual es ${this.getCardName(this.currentCard)} ¿La proxima sera mayor o menor?`;
    this.changeDetectorRef.detectChanges();
  }

  async makeGuess(isHigher: boolean): Promise<void> {
    if (!this.currentCard || this.gameOver) return;
    
    if (this.deck.length === 0) {
      this.endGame();
      return;
    }
    
    this.nextCard = this.deck.pop()!;
    this.showNextCard = true;
    this.changeDetectorRef.detectChanges();
    
    // Add a small delay for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentValue = this.getCardValue(this.currentCard);
    const nextValue = this.getCardValue(this.nextCard);
    
    if (currentValue === nextValue) {
      this.message = `¡Empate!`;
    } else if (
      (isHigher && nextValue > currentValue) || 
      (!isHigher && nextValue < currentValue)
    ) {
      this.score++;
      this.message = `Correcto ${this.getCardName(this.nextCard)} es ${nextValue > currentValue ? 'mayor' : 'menor'}`;
    } else {
      this.message = `Incorrecto ${this.getCardName(this.nextCard)} es ${nextValue > currentValue ? 'mayor' : 'menor'}`;
    }
    
    this.currentCard = this.nextCard;
    this.nextCard = null;
    
    if (this.deck.length === 0) {
      this.endGame();
    } else {
      // Hide the next card after a delay
      setTimeout(() => {
        this.showNextCard = false;
        this.changeDetectorRef.detectChanges();
      }, 100);
    }
    
    this.changeDetectorRef.detectChanges();
  }

  endGame(): void {
    this.gameOver = true;
    this.puntajeService.guardarPuntos("mayorOmenor",this.score);
    Swal.fire({
      icon: 'info',
      title: 'Juego Terminado',
      html: `
        <div style="font-size: 1.2rem; margin-bottom: 1rem;">
          Tu puntuación: <strong>${this.score}</strong>
        </div>
        <div>¿Qué te gustaría hacer ahora?</div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Jugar de Nuevo',
      cancelButtonText: 'Volver al Menú',
      reverseButtons: true,
      backdrop: true,
      allowOutsideClick: false,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title'
      }
    }).then((r) => {
      if (r.isConfirmed) {
        this.reiniciarJuego();
      } else if (r.dismiss === Swal.DismissReason.cancel) {
        this.volverAlHome();
      }
    });
    this.changeDetectorRef.detectChanges();
  }

  getCardValue(card: Card): number {
    // Ace is high in this game
    return card.number;
  }

  reiniciarJuego(): void {
    window.location.reload();
  }

  volverAlHome() {
    this.router.navigateByUrl('/home');
  }

  getCardName(card: Card): string {
    const valueNames: {[key: number]: string} = {
      1: 'As',
      11: 'Jota',
      12: 'Reina',
      13: 'Rey'
    };
    
    const suitNames: {[key: string]: string} = {
      'spade': 'Picas',
      'heart': 'Corazones',
      'diamond': 'Diamantes',
      'club': 'Treboles'
    };
    
    const valueName = valueNames[card.number] || card.number.toString();
    return `${valueName} de ${suitNames[card.type]}`;
  }
}