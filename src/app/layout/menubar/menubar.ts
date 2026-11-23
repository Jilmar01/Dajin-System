import { Component, computed, ElementRef, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Rol } from '../../models/rol';

interface NavigationItem {
  label: string;
  route: string;
  roles: Rol[];
  exact?: boolean;
}

@Component({
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  selector: 'app-menubar',
  styleUrl: './menubar.css',
  templateUrl: './menubar.html',
})
export class Menubar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly session = this.authService.userSession;

  readonly navigationItems: NavigationItem[] = [
    { label: 'Start', route: '/', roles: [Rol.ADMIN, Rol.USER], exact: true },
    { label: 'Users', route: '/users', roles: [Rol.ADMIN] },
    { label: 'Categories', route: '/categories', roles: [Rol.ADMIN, Rol.USER] },
    { label: 'Departments', route: '/departments', roles: [Rol.ADMIN, Rol.USER] },
    { label: 'Assets', route: '/assets', roles: [Rol.ADMIN, Rol.USER] }
  ];
  readonly visibleNavigation = computed(() =>
    this.navigationItems.filter((item) => this.authService.isRol(item.roles)),
  );

  menuOpen = false;
  readonly avatarColor = this.pickAvatarColor();

  get userName(): string {
    return this.session()?.username || 'User';
  }

  get userInitial(): string {
    return this.userName.trim().charAt(0).toUpperCase() || 'U';
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.menuOpen = false;
    void this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  closeMenuWhenClickingOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.menuOpen = false;
    }
  }

  private pickAvatarColor(): string {
    //const colors = ['#6347f9', '#0f766e', '#c2410c', '#2563eb', '#be185d', '#4d7c0f'];
    const colors = ['#6347f9'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
