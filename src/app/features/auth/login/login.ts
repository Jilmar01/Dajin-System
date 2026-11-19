import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  imports: [
    ReactiveFormsModule
  ],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly frmBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly error = signal<string | null>(null);
  readonly loading = signal<boolean>(false);

  readonly frmLogin = this.frmBuilder.nonNullable.group({
    username: ['admin', Validators.required],
    password: ['admin123', Validators.required]
  });

  login(): void {
    if (this.frmLogin.invalid) {
      this.frmLogin.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.frmLogin.getRawValue()).subscribe({
      next: () => this.router.navigate(['/']),
      error: (er: Error) => {
        this.error.set(er.message);
        this.loading.set(false);
      }
    })
  }
}
