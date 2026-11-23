import { Component, inject, OnInit, signal } from '@angular/core';
import { DepartmentService } from '../department.service';
import { DepartmentResponse } from '../department.model';
import { catchError, finalize, Observable, of } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { DepartmentForm } from '../department-form/department-form';

@Component({
  imports: [AsyncPipe, CurrencyPipe, DepartmentForm],
  selector: 'app-department-list',
  styleUrl: './department-list.css',
  templateUrl: './department-list.html',
})
export class DepartmentList implements OnInit {
  private readonly departmentService = inject(DepartmentService);

  departments$!: Observable<DepartmentResponse[]>;
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  readonly pageSize = 5;
  readonly currentPage = signal(1);
  readonly formModalOpen = signal(false);
  readonly selectedDepartment = signal<DepartmentResponse | null>(null);

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments(): void {
    this.currentPage.set(1);
    this.loading.set(true);
    this.departments$ = this.departmentService.getDepartment()
      .pipe(
        catchError(err => {
          this.error.set(err.message);
          return of([]);
        }),
        finalize(() => this.loading.set(false))
      )
  }

  openCreateModal(): void {
    this.selectedDepartment.set(null);
    this.formModalOpen.set(true);
  }

  closeFormModal(): void {
    this.formModalOpen.set(false);
    this.selectedDepartment.set(null);
  }

  onDepartmentSubmitted(): void {
    this.closeFormModal();
    this.getDepartments();
  }

  totalPages(totalRecords: number): number {
    return Math.max(1, Math.ceil(totalRecords / this.pageSize));
  }

  changePage(page: number, totalRecords: number): void {
    this.currentPage.set(Math.min(Math.max(page, 1), this.totalPages(totalRecords)))
  }

  firstVisibleRecord(totalRecords: number): number {
    return totalRecords === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1;
  }

  lastVisibleRecord(totalRecords: number): number {
    return Math.min(this.currentPage() * this.pageSize, totalRecords);
  }

}

