import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, finalize } from 'rxjs';
import { CategoryResponse } from '../../category/category.model';
import { CategoryService } from '../../category/category.service';
import { DepartmentResponse } from '../../department/department.model';
import { DepartmentService } from '../../department/department.service';
import { AssetRequest } from '../asset.model';
import { AssetService } from '../asset.service';

@Component({
  selector: 'app-asset-form',
  imports: [ReactiveFormsModule],
  templateUrl: './asset-form.html',
  styleUrl: './asset-form.css',
})
export class AssetForm implements OnInit {
  private readonly assetService = inject(AssetService);
  private readonly categoryService = inject(CategoryService);
  private readonly departmentService = inject(DepartmentService);

  @Output() submitted = new EventEmitter<AssetRequest>();
  @Output() cancelled = new EventEmitter<void>();

  readonly isSubmitting = signal(false);
  readonly isLoadingOptions = signal(true);
  readonly formError = signal<string | null>(null);
  readonly categories = signal<CategoryResponse[]>([]);
  readonly departments = signal<DepartmentResponse[]>([]);
  readonly form = new FormGroup({
    codigoInventario: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    marca: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    modelo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    numeroSerie: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    costoAdquisicion: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    moneda: new FormControl('USD', { nonNullable: true, validators: [Validators.required] }),
    fechaAdquisicion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    finGarantia: new FormControl('', { nonNullable: true }),
    categoriaId: new FormControl<number | null>(null, Validators.required),
    departamentoId: new FormControl<number | null>(null, Validators.required),
  });

  ngOnInit(): void {
    forkJoin({
      categories: this.categoryService.getCategories(),
      departments: this.departmentService.getDepartment(),
    })
      .pipe(finalize(() => this.isLoadingOptions.set(false)))
      .subscribe({
        next: options => {
          this.categories.set(options.categories);
          this.departments.set(options.departments);
        },
        error: error => this.formError.set(this.errorText(error, 'Could not load categories and departments.')),
      });
  }

  submit(): void {
    if (this.form.invalid || this.isLoadingOptions()) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    if (values.costoAdquisicion === null || values.categoriaId === null || values.departamentoId === null) return;

    const request: AssetRequest = {
      codigoInventario: values.codigoInventario.trim(),
      nombre: values.nombre.trim(),
      marca: values.marca.trim(),
      modelo: values.modelo.trim(),
      numeroSerie: values.numeroSerie.trim(),
      costoAdquisicion: values.costoAdquisicion,
      moneda: values.moneda.trim().toUpperCase(),
      fechaAdquisicion: values.fechaAdquisicion,
      finGarantia: values.finGarantia,
      categoriaId: values.categoriaId,
      departamentoId: values.departamentoId,
    };

    this.formError.set(null);
    this.isSubmitting.set(true);
    this.assetService.addAsset(request)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => this.submitted.emit(request),
        error: error => this.formError.set(this.errorText(error, 'Could not create the asset.')),
      });
  }

  private errorText(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.message;
      return typeof message === 'string' && message.trim() ? message : error.message || fallback;
    }
    return error instanceof Error ? error.message : fallback;
  }
}
