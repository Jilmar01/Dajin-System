import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DepartmentRequest, DepartmentResponse } from './department.model';
import { ActionResponse } from '../../models/action-response';
import { environment } from '../../../environments/environment';

@Service()
export class DepartmentService {
    private readonly httpClient = inject(HttpClient);

    private readonly routeDepartment = `${environment.apiURL}/departamentos`;

    getDepartment(): Observable<DepartmentResponse[]> {
        return this.httpClient
            .get<ActionResponse<DepartmentResponse[]>>(this.routeDepartment)
            .pipe(map(res => res.results));
    }

    addDepartment(department: DepartmentRequest): Observable<DepartmentResponse> {
        return this.httpClient
            .post<ActionResponse<DepartmentResponse>>(this.routeDepartment, department)
            .pipe(map((res) => res.results));
    }
}
