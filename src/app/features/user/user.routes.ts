import { Routes } from "@angular/router";
import { UserList } from "./user-list/user-list";

export const USER_ROUTES: Routes = [
    {
        path: '', component: UserList
    }
]