import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Rol } from '../../../models/rol';
import { UserRequest } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  private readonly userService = inject(UserService);

  @Output() submitted = new EventEmitter<UserRequest>();
  @Output() cancelled = new EventEmitter<void>();

  readonly isSubmitting = signal(false);
  readonly formError = signal<string | null>(null);
  readonly roles = [Rol.ADMIN, Rol.USER];

  readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rol: new FormControl<Rol>(Rol.USER, { nonNullable: true, validators: [Validators.required] }),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    const request: UserRequest = {
      username: values.username.trim(),
      password: values.password,
      rol: values.rol,
    };

    this.formError.set(null);
    this.isSubmitting.set(true);

    this.userService.addUser(request)
      .pipe(
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe({
        next: () => this.submitted.emit(request),
        error: (error: Error) => {
          this.formError.set(error.message || 'Could not create the user.');
        }
      });
  }
}
