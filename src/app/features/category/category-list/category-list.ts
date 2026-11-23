import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from '../category.service';
import { catchError, finalize, Observable, of } from 'rxjs';
import { CategoryResponse } from '../category.model';
import { AsyncPipe } from '@angular/common';
import { CategoryForm } from '../category-form/category-form';

@Component({
  imports: [AsyncPipe, CategoryForm],
  selector: 'app-category-list',
  styleUrl: './category-list.css',
  templateUrl: './category-list.html',
})
export class CategoryList implements OnInit {
  private readonly categoryService = inject(CategoryService);

  categories$!: Observable<CategoryResponse[]>;
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  readonly formModalOpen = signal(false);
  readonly selectedCategory = signal<CategoryResponse | null>(null);
  readonly pageSize = 5;
  readonly currentPage = signal(1);

  ngOnInit(): void {
    this.getCategories();
  }

  openCreateModal(): void {
    this.selectedCategory.set(null);
    this.formModalOpen.set(true);
  }

  openEditModal(category: CategoryResponse): void {
    this.selectedCategory.set(category);
    this.formModalOpen.set(true);
  }

  closeFormModal(): void {
    this.formModalOpen.set(false);
    this.selectedCategory.set(null);
  }

  onCategorySubmitted(): void {
    this.error.set(null);
    this.closeFormModal();
    this.getCategories();
  }

  getCategories(): void {
    this.currentPage.set(1);
    this.loading.set(true);
    this.categories$ = this.categoryService.getCategories().pipe(
      catchError(err => {
        this.error.set(err.message);
        return of([]);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  totalPages(totalUsers: number): number {
    return Math.max(1, Math.ceil(totalUsers / this.pageSize));
  }

  changePage(page: number, totalUsers: number): void {
    this.currentPage.set(Math.min(Math.max(page, 1), this.totalPages(totalUsers)));
  }

  firstVisibleUser(totalUsers: number): number {
    return totalUsers === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1;
  }

  lastVisibleUser(totalUsers: number): number {
    return Math.min(this.currentPage() * this.pageSize, totalUsers);
  }
}
