import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../user.service';
import { catchError, finalize, Observable, of } from 'rxjs';
import { UserResponse } from '../user.model';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  imports: [
    AsyncPipe,
    DatePipe,
  ],
  selector: 'app-user-list',
  styleUrl: './user-list.css',
  templateUrl: './user-list.html',
})
export class UserList implements OnInit {
  private readonly userService = inject(UserService);

  users$!: Observable<UserResponse[]>;
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  readonly pageSize = 5;
  readonly currentPage = signal(1);

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.currentPage.set(1);
    this.loading.set(true);
    this.users$ = this.userService.getUsers().pipe(
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
