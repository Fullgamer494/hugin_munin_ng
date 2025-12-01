package com.hugin_munin.api.application.services

import com.hugin_munin.api.domain.models.*
import com.hugin_munin.api.domain.ports.AuthRepository
import com.hugin_munin.api.infrastructure.config.JwtConfig
import org.mindrot.jbcrypt.BCrypt

class AuthService(
    private val authRepository: AuthRepository
) {

    suspend fun login(email: String, password: String, ipAddress: String?, userAgent: String?): TokenResponse? {
        // Buscar usuario por email
        val user = authRepository.findUserByEmail(email) ?: return null

        // Verificar que el usuario esté activo
        if (!user.activo) {
            return null
        }

        // DESCOMENTAR Y CAMBIAR hashedPassword por contrasena:
        if (password != user.contrasena) {
            return null
        }

        // Generar claims para el JWT
        val claims = JwtClaims(
            userId = user.id,
            email = user.correo,
            role = user.rolNombre,
            permissions = user.permisos
        )

        // Generar tokens
        val accessToken = JwtConfig.generateAccessToken(claims)
        val refreshToken = JwtConfig.generateRefreshToken(user.id)

        // Guardar refresh token en la base de datos
        val expiresAt = System.currentTimeMillis() + JwtConfig.REFRESH_TOKEN_VALIDITY
        authRepository.saveRefreshToken(
            userId = user.id,
            token = refreshToken,
            expiresAt = expiresAt,
            ipAddress = ipAddress,
            userAgent = userAgent
        )

        return TokenResponse(
            accessToken = accessToken,
            refreshToken = refreshToken,
            expiresIn = JwtConfig.ACCESS_TOKEN_VALIDITY / 1000, // En segundos
            tokenType = "Bearer"
        )
    }

    suspend fun refreshToken(refreshToken: String): TokenResponse? {
        // Verificar que el refresh token existe y es válido
        val tokenInfo = authRepository.findRefreshToken(refreshToken) ?: return null

        // Verificar que no esté revocado
        if (tokenInfo.revoked) {
            return null
        }

        // Verificar que no haya expirado
        if (tokenInfo.expiresAt < System.currentTimeMillis()) {
            return null
        }

        // Obtener información del usuario
        val user = authRepository.findUserById(tokenInfo.userId) ?: return null

        // Generar nuevo access token
        val claims = JwtClaims(
            userId = user.id,
            email = user.correo,
            role = user.rolNombre,
            permissions = user.permisos
        )

        val newAccessToken = JwtConfig.generateAccessToken(claims)

        return TokenResponse(
            accessToken = newAccessToken,
            refreshToken = refreshToken, // El refresh token se mantiene igual
            expiresIn = JwtConfig.ACCESS_TOKEN_VALIDITY / 1000,
            tokenType = "Bearer"
        )
    }

    suspend fun logout(refreshToken: String): Boolean {
        return authRepository.revokeRefreshToken(refreshToken)
    }

    suspend fun logoutAllSessions(userId: Int): Boolean {
        return authRepository.revokeAllUserTokens(userId)
    }

    suspend fun validateToken(token: String): JwtClaims? {
        return JwtConfig.verifyToken(token)
    }

    suspend fun getCurrentUser(userId: Int): AuthenticatedUser? {
        return authRepository.findUserById(userId)
    }

    // Utilidad para hashear contraseñas (usar al crear usuarios)
    fun hashPassword(password: String): String {
        return BCrypt.hashpw(password, BCrypt.gensalt())
    }

    // Utilidad para verificar contraseñas
    fun verifyPassword(password: String, hashedPassword: String): Boolean {
        return BCrypt.checkpw(password, hashedPassword)
    }
}