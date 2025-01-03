import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  show(message: string, action = 'Close', duration = 3000): void {
    this.snackBar.open(message, action, {
      duration,
    });
  }
}
