import { Observable } from "rxjs"
import { LoginRequest, TokenResponse } from "../models/auth.model"

export abstract class AuthPort {
    abstract login(login: LoginRequest): Observable<TokenResponse>;
    abstract logout(): void;
}