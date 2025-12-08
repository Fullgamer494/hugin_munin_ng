package com.hugin_munin.api.infrastructure.config

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.hugin_munin.api.domain.models.JwtClaims
import java.util.*

object JwtConfig {
    private const val SECRET = "hugin-munin-secret-key-2024-change-in-production"
    private const val ISSUER = "hugin-munin-api"
    private const val AUDIENCE = "hugin-munin-users"

    const val ACCESS_TOKEN_VALIDITY = 3600000L
    const val REFRESH_TOKEN_VALIDITY = 604800000L

    private val algorithm = Algorithm.HMAC256(SECRET)

    fun generateAccessToken(claims: JwtClaims): String {
        return JWT.create()
            .withAudience(AUDIENCE)
            .withIssuer(ISSUER)
            .withClaim("userId", claims.userId)
            .withClaim("email", claims.email)
            .withClaim("role", claims.role)
            .withArrayClaim("permissions", claims.permissions.toTypedArray())
            .withExpiresAt(Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY))
            .sign(algorithm)
    }

    fun generateRefreshToken(userId: Int): String {
        return JWT.create()
            .withAudience(AUDIENCE)
            .withIssuer(ISSUER)
            .withClaim("userId", userId)
            .withClaim("type", "refresh")
            .withExpiresAt(Date(System.currentTimeMillis() + REFRESH_TOKEN_VALIDITY))
            .sign(algorithm)
    }

    fun verifyToken(token: String): JwtClaims? {
        return try {
            val verifier = JWT.require(algorithm)
                .withAudience(AUDIENCE)
                .withIssuer(ISSUER)
                .build()

            val decodedJWT = verifier.verify(token)

            JwtClaims(
                userId = decodedJWT.getClaim("userId").asInt(),
                email = decodedJWT.getClaim("email").asString(),
                role = decodedJWT.getClaim("role").asString(),
                permissions = decodedJWT.getClaim("permissions").asList(String::class.java)
            )
        } catch (e: Exception) {
            null
        }
    }

    fun getSecret() = SECRET
    fun getIssuer() = ISSUER
    fun getAudience() = AUDIENCE
}