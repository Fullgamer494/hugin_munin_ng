import { Observable } from "rxjs";
import { LoginRequest, TokenResponse } from "../models/auth.model";
import { UserInfoResponse } from "../models/user.model";

export abstract class AuthPort {
    abstract login(login: LoginRequest): Observable<TokenResponse>;
    abstract logout(): void;
    abstract isAuthenticated(): boolean;
    abstract getCurrentUserId(): number | null;

    abstract getCurrentUser(): Observable<UserInfoResponse>;
}