import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() title = 'Modal Title';
  @Output() closed = new EventEmitter<void>();

  closeModal(): void {
    this.closed.emit();
  }
}
