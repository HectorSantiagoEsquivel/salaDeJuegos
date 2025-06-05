import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Import standalone components (but don't declare them)
import { GameComponent } from './components/game/game.component';
import { CardComponent } from './components/card/card.component';
import { PileComponent } from './components/pile/pile.component';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector.component';
import { FooterComponent } from './components/footer/footer.component';

// Services
import { DeckService } from './services/deck/deck.service';
import { GameService } from './services/game/game.service';
import { UtilService } from './services/util/util.service';
import { AnimateHelperService } from './services/animate-helper/animate-helper.service';
import { ConfigService } from './services/config/config.service';

@NgModule({
  // Leave declarations EMPTY for standalone components
  declarations: [],
  
  // Import standalone components here instead
  imports: [
    CommonModule,
    DragDropModule,
    GameComponent,
    CardComponent,
    PileComponent,
    ThemeSelectorComponent,
    FooterComponent
  ],
  providers: [
    DeckService,
    GameService,
    UtilService,
    AnimateHelperService,
    ConfigService
  ],
  exports: [
    GameComponent // Only expose the main game component
  ]
})
export class SolitaireModule { }