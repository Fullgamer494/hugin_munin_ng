package com.hugin_munin.api.domain.models

import kotlinx.serialization.Serializable

@Serializable
data class TokenResponse(
    val accessToken: String,
    val refreshToken: String,
    val expiresIn: Long,
    val tokenType: String = "Bearer"
)

@Serializable
data class LoginRequest(
    val correo: String,
    val contrasena: String
)

@Serializable
data class RefreshTokenRequest(
    val refreshToken: String
)

data class JwtClaims(
    val userId: Int,
    val email: String,
    val role: String,
    val permissions: List<String>
)

data class AuthenticatedUser(
    val id: Int,
    val nombreUsuario: String,
    val correo: String,
    val rolId: Int,
    val rolNombre: String,
    val permisos: List<String>,
    val activo: Boolean
)

data class RefreshTokenInfo(
    val id: Int,
    val userId: Int,
    val token: String,
    val expiresAt: Long,
    val revoked: Boolean
)