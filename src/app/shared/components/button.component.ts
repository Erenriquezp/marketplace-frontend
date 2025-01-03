import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() type: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;

  get buttonClass(): string {
    return this.type;
  }

  handleClick(event: MouseEvent): void {
    console.log('Button clicked', event);
  }
}
