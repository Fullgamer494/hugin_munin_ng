package com.hugin_munin.api.domain.ports

import com.hugin_munin.api.domain.models.AuthenticatedUser

interface AuthRepository {
    suspend fun findUserByEmail(email: String): AuthenticatedUser?
    suspend fun findUserById(id: Int): AuthenticatedUser?
    suspend fun saveRefreshToken(userId: Int, token: String, expiresAt: Long, ipAddress: String?, userAgent: String?): Boolean
    suspend fun findRefreshToken(token: String): RefreshTokenInfo?
    suspend fun revokeRefreshToken(token: String): Boolean
    suspend fun revokeAllUserTokens(userId: Int): Boolean
}

data class RefreshTokenInfo(
    val id: Int,
    val userId: Int,
    val token: String,
    val expiresAt: Long,
    val revoked: Boolean
)