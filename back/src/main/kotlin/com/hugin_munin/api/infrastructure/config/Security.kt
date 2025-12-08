package com.hugin_munin.api.infrastructure.config

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.http.*
import io.ktor.server.response.*

fun Application.configureSecurity() {
    install(Authentication) {
        jwt("auth-jwt") {
            realm = "Hugin Munin API"

            verifier(
                JWT
                    .require(Algorithm.HMAC256(JwtConfig.getSecret()))
                    .withAudience(JwtConfig.getAudience())
                    .withIssuer(JwtConfig.getIssuer())
                    .build()
            )

            validate { credential ->
                if (credential.payload.audience.contains(JwtConfig.getAudience())) {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }

            challenge { _, _ ->
                call.respond(
                    HttpStatusCode.Unauthorized,
                    mapOf("error" to "Token inválido o expirado")
                )
            }
        }
    }
}

// Extension para obtener el userId del token
val ApplicationCall.userId: Int
    get() = principal<JWTPrincipal>()
        ?.payload
        ?.getClaim("userId")
        ?.asInt()
        ?: throw IllegalStateException("Usuario no autenticado")

// Extension para obtener el email del token
val ApplicationCall.userEmail: String
    get() = principal<JWTPrincipal>()
        ?.payload
        ?.getClaim("email")
        ?.asString()
        ?: throw IllegalStateException("Usuario no autenticado")

// Extension para obtener el rol del token
val ApplicationCall.userRole: String
    get() = principal<JWTPrincipal>()
        ?.payload
        ?.getClaim("role")
        ?.asString()
        ?: throw IllegalStateException("Usuario no autenticado")

// Extension para obtener los permisos del token
val ApplicationCall.userPermissions: List<String>
    get() = principal<JWTPrincipal>()
        ?.payload
        ?.getClaim("permissions")
        ?.asList(String::class.java)
        ?: emptyList()

// Extension para verificar si el usuario tiene un permiso específico
fun ApplicationCall.hasPermission(permission: String): Boolean {
    return userPermissions.contains(permission)
}

// Extension para verificar si el usuario tiene todos los permisos requeridos
fun ApplicationCall.hasAllPermissions(vararg permissions: String): Boolean {
    val userPerms = userPermissions
    return permissions.all { it in userPerms }
}

// Extension para verificar si el usuario tiene al menos uno de los permisos
fun ApplicationCall.hasAnyPermission(vararg permissions: String): Boolean {
    val userPerms = userPermissions
    return permissions.any { it in userPerms }
}