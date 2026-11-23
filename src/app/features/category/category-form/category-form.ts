import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { CategoryRequest, CategoryResponse } from '../category.model';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm implements OnChanges {
  private readonly categoryService = inject(CategoryService);

  @Input() category: CategoryResponse | null = null;
  @Input() errorMessage: string | null = null;

  @Output() submitted = new EventEmitter<CategoryRequest>();
  @Output() cancelled = new EventEmitter<void>();

  readonly isSubmitting = signal(false);
  readonly formError = signal<string | null>(null);

  readonly form = new FormGroup({
    codigo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descripcion: new FormControl('', { nonNullable: true }),
    vidaUtilAnios: new FormControl<number | null>(null, Validators.required),
    tasaDepreciacionAnual: new FormControl<number | null>(null, Validators.required),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['category']) return;

    this.formError.set(null);

    if (this.category) {
      this.form.reset({
        codigo: this.category.codigo,
        nombre: this.category.nombre,
        descripcion: this.category.descripcion,
        vidaUtilAnios: this.category.vidaUtilAnios,
        tasaDepreciacionAnual: this.category.tasaDepreciacionAnual,
      });
      return;
    }

    this.form.reset({
      codigo: '',
      nombre: '',
      descripcion: '',
      vidaUtilAnios: null,
      tasaDepreciacionAnual: null,
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    if (values.vidaUtilAnios === null || values.tasaDepreciacionAnual === null) return;

    const request: CategoryRequest = {
      codigo: values.codigo.trim(),
      nombre: values.nombre.trim(),
      descripcion: values.descripcion.trim(),
      vidaUtilAnios: values.vidaUtilAnios,
      tasaDepreciacionAnual: values.tasaDepreciacionAnual,
    };

    this.formError.set(null);
    this.isSubmitting.set(true);

    const saveRequest = this.category
      ? this.categoryService.updateCategory(this.category.id, request)
      : this.categoryService.addCategory(request);

    saveRequest
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => this.submitted.emit(request),
        error: (error: unknown) => this.formError.set(this.errorText(error)),
      });
  }

  private errorText(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const serverMessage = error.error?.message;
      return typeof serverMessage === 'string' && serverMessage.trim()
        ? serverMessage
        : error.message || this.defaultErrorMessage();
    }

    return error instanceof Error ? error.message : this.defaultErrorMessage();
  }

  private defaultErrorMessage(): string {
    return this.category ? 'Could not update the category.' : 'Could not create the category.';
  }
}
