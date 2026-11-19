import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { UserResponse } from "./user.model";
import { ActionResponse } from "../../models/action-response";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly httpCliente = inject(HttpClient);

    getUsers(): Observable<UserResponse[]> {
        return this.httpCliente
            .get<ActionResponse<UserResponse[]>>(`${environment.apiURL}/usuarios`)
            .pipe(map((res) => res.results));
    }

}
