// messaging/components/message-input/message-input.component.ts
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent {
  @Output() send = new EventEmitter<string>();

  text = '';

  onSend(): void {
    const value = this.text.trim();
    if (!value) return;
    this.send.emit(value);
    this.text = '';
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSend();
    }
  }
}
