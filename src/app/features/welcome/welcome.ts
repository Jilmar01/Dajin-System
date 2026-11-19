import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-welcome',
  styleUrl: './welcome.css',
  templateUrl: './welcome.html',
})
export class Welcome {
  private readonly authService = inject(AuthService);

  get userName(): string {
    const username = this.authService.userSession()?.username || 'User';
    return username.charAt(0).toUpperCase() + username.slice(1);
  }
}
