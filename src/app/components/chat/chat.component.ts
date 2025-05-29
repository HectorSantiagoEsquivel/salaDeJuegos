import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messageText = '';
  messages: any[] = [];
  isLoading = true;
  currentUserData: any;
  private messagesSub!: Subscription;
  private newMessagesSub: any;
  private currentUserSub!: Subscription; // ⬅️ nuevo

  constructor(private chatService: ChatService) {}

  async ngOnInit() {
    await this.loadInitialData();

    // ⬇️ Suscribirse al usuario actual
    this.currentUserSub = this.chatService.currentUserData$.subscribe(data => {
      this.currentUserData = data;
    });

    // Mensajes nuevos en tiempo real
    this.newMessagesSub = this.chatService.subscribeToNewMessages(
      (newMessage) => {
        this.messages = [newMessage, ...this.messages];
      }
    );

    // Lista completa de mensajes
    this.messagesSub = this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
    });

    // Estado de carga
    this.chatService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  async loadInitialData() {
    try {
      await this.chatService.loadInitialData();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async sendMessage() {
    try {
      await this.chatService.sendMessage(this.messageText);
      this.messageText = '';
    } catch (error) {
      console.error('Error al enviar:', error);
    }
  }

  formatDate(isoDate: string): string {
    return this.chatService.formatDate(isoDate);
  }

  ngOnDestroy() {
    if (this.messagesSub) this.messagesSub.unsubscribe();
    if (this.newMessagesSub) this.newMessagesSub.unsubscribe();
    if (this.currentUserSub) this.currentUserSub.unsubscribe(); // ⬅️ también limpiar
  }
}
