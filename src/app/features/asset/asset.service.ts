import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AssetRequest, AssetResponse } from './asset.model';
import { ActionResponse } from '../../models/action-response';
import { environment } from '../../../environments/environment';
import { AssetStatus } from './asset.status';

@Service()
export class AssetService {
    private readonly httpClient = inject(HttpClient);

    private readonly routeAssets = `${environment.apiURL}/activos`;

    getAssets(): Observable<AssetResponse[]> {
        return this.httpClient
            .get<ActionResponse<AssetResponse[]>>(this.routeAssets)
            .pipe(map(res => res.results));
    }

    addAsset(asset: AssetRequest): Observable<AssetResponse> {
        return this.httpClient
            .post<ActionResponse<AssetResponse>>(this.routeAssets, asset)
            .pipe(map(res => res.results));
    }

    updateStatusAssets(id: number, status: AssetStatus): Observable<AssetResponse> {
        console.log(status);
        return this.httpClient
            .put<ActionResponse<AssetResponse>>(`${this.routeAssets}/${id}/estado`, { estado: status })
            .pipe(map(res => res.results));
    }

}
