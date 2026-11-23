import { Component, inject, OnInit, signal } from '@angular/core';
import { AssetResponse } from '../asset.model';
import { catchError, finalize, Observable, of } from 'rxjs';
import { AssetService } from '../asset.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { AssetStatus } from '../asset.status';

@Component({
  imports: [AsyncPipe, CurrencyPipe],
  selector: 'app-asset-list',
  styleUrl: './asset-list.css',
  templateUrl: './asset-list.html',
})
export class AssetList implements OnInit {
  private readonly assetService = inject(AssetService);
  readonly AssetStatus = AssetStatus;

  assets$!: Observable<AssetResponse[]>;
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  readonly pageSize = 5;
  readonly currentPage = signal(1);
  readonly openStatusMenuId = signal<number | null>(null);
  readonly updatingStatusAssetId = signal<number | null>(null);
  readonly statuses = Object.values(AssetStatus);

  ngOnInit(): void {
    this.getAssets();
  }

  getAssets(): void {
    this.currentPage.set(1);
    this.error.set(null);
    this.loading.set(true);
    this.assets$ = this.assetService.getAssets().pipe(
      catchError(err => {
        this.error.set(err.message || 'Could not load assets.');
        return of([]);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  totalPages(totalAssets: number): number {
    return Math.max(1, Math.ceil(totalAssets / this.pageSize));
  }

  changePage(page: number, totalAssets: number): void {
    this.currentPage.set(Math.min(Math.max(page, 1), this.totalPages(totalAssets)));
  }

  firstVisibleAsset(totalAssets: number): number {
    return totalAssets === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1;
  }

  lastVisibleAsset(totalAssets: number): number {
    return Math.min(this.currentPage() * this.pageSize, totalAssets);
  }

  shouldOpenStatusMenuAbove(rowIndex: number, totalAssets: number): boolean {
    const remainingAssets = totalAssets - (this.currentPage() - 1) * this.pageSize;
    const visibleRows = Math.min(this.pageSize, remainingAssets);
    return rowIndex >= Math.max(0, visibleRows - 2);
  }

  statusLabel(status: AssetStatus): string {
    switch (status) {
      case AssetStatus.ASSIGNED:
        return 'Assigned';
      case AssetStatus.AVAILABLE:
        return 'Available';
      case AssetStatus.IN_MAINTENANCE:
        return 'In Maintenance';
      case AssetStatus.RETIRED:
        return 'Retired';
      default:
        return status;
    }
  }

  changeAssetStatus(asset: AssetResponse, status: AssetStatus): void {
    if (this.updatingStatusAssetId() !== null || asset.estado === status) {
      return;
    }

    this.error.set(null);
    this.openStatusMenuId.set(null);
    this.updatingStatusAssetId.set(asset.id);

    this.assetService.updateStatusAssets(asset.id, status)
      .pipe(finalize(() => this.updatingStatusAssetId.set(null)))
      .subscribe({
        next: updatedAsset => {
          asset.estado = updatedAsset.estado;
        },
        error: (err: Error) => {
          this.error.set(err.message || 'Could not update the asset status.');
        },
      });
  }
}
