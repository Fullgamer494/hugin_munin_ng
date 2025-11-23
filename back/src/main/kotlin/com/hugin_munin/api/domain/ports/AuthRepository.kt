package com.hugin_munin.api.domain.ports

import com.hugin_munin.api.domain.models.AuthenticatedUser
import com.hugin_munin.api.domain.models.RefreshTokenInfo

interface AuthRepository {
    suspend fun findUserByEmail(email: String): AuthenticatedUser?
    suspend fun findUserById(id: Int): AuthenticatedUser?
    suspend fun saveRefreshToken(userId: Int, token: String, expiresAt: Long, ipAddress: String?, userAgent: String?): Boolean
    suspend fun findRefreshToken(token: String): RefreshTokenInfo?
    suspend fun revokeRefreshToken(token: String): Boolean
    suspend fun revokeAllUserTokens(userId: Int): Boolean
}