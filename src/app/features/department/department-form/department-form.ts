import { Component, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentRequest, DepartmentResponse } from '../department.model';
import { DepartmentService } from '../department.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-department-form',
  imports: [ReactiveFormsModule],
  templateUrl: './department-form.html',
  styleUrl: './department-form.css',
})
export class DepartmentForm implements OnChanges {
  private readonly departmentService = inject(DepartmentService);

  @Input() department: DepartmentResponse | null = null;

  @Output() submitted = new EventEmitter<DepartmentRequest>();
  @Output() cancelled = new EventEmitter<void>();

  readonly isSubmitting = signal(false);
  readonly formError = signal<string | null>(null);

  readonly form = new FormGroup({
    codigo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    edificio: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    piso: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    presupuestoMaximo: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['department']) return;

    if (this.department) {
      this.form.reset({
        codigo: this.department.codigo,
        nombre: this.department.nombre,
        edificio: this.department.edificio,
        piso: this.department.piso,
        presupuestoMaximo: this.department.presupuestoMaximo,
      });
      return;
    }

    this.form.reset({ codigo: '', nombre: '', edificio: '', piso: '', presupuestoMaximo: null });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    if (values.presupuestoMaximo === null) return;

    const request: DepartmentRequest = {
      codigo: values.codigo.trim(),
      nombre: values.nombre.trim(),
      edificio: values.edificio.trim(),
      piso: values.piso.trim(),
      presupuestoMaximo: values.presupuestoMaximo,
      valorActualActivos: this.department?.valorActualActivos ?? 0,
      presupuestoDisponible: this.department
        ? values.presupuestoMaximo - this.department.valorActualActivos
        : values.presupuestoMaximo,
    };

    this.formError.set(null);
    this.isSubmitting.set(true);
  
    this.departmentService.addDepartment(request)
    .pipe(
      finalize(() => this.isSubmitting.set(false))
    )
    .subscribe({
      next: () => this.submitted.emit(request),
      error: (error: Error) => {
        this.formError.set(error.message || 'Could not create the department');
      }
    });
  }
}
