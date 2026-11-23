import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ActionResponse } from '../../models/action-response';
import { environment } from '../../../environments/environment';
import { CategoryRequest, CategoryResponse } from './category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    private readonly httpClient = inject(HttpClient);
    private routeCategory = `${environment.apiURL}/categorias`

    getCategories(): Observable<CategoryResponse[]> {
        return this.httpClient
            .get<ActionResponse<CategoryResponse[]>>(this.routeCategory)
            .pipe(map((res) => res.results));
    }

    addCategory(category: CategoryRequest) {
        return this.httpClient
            .post<ActionResponse<CategoryResponse>>(this.routeCategory, category)
            .pipe(map((res) => res.results));
    }

    updateCategory(id: number, category: CategoryRequest) {
        return this.httpClient
            .put<ActionResponse<CategoryResponse>>(`${this.routeCategory}/${id}`, category)
            .pipe(map((res) => res.results));
    }

}
