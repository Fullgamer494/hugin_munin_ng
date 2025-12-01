export interface LoginRequest {
    correo: string,
    contrasena: string
}

export interface TokenResponse {
    accessToken: string,
    refreshToken: string,
    expiresIn: number
}