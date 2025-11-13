package com.hugin_munin.infrastructure.plugins

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureSecurity() {
    val jwtAudience = "jwt-audience"
    val jwtDomain = "https://jwt-provider-domain/"
    val jwtRealm = "ktor sample app"
    val jwtSecret = "secret"

    authentication {
        jwt {
            realm = jwtRealm
            verifier(
                JWT
                    .require(Algorithm.HMAC256(jwtSecret))
                    .withAudience(jwtAudience)
                    .withIssuer(jwtDomain)
                    .build()
            )
            validate { credential ->
                if (credential.payload.audience.contains(jwtAudience))
                    JWTPrincipal(credential.payload)
                else null
            }
        }
    }
}

enum class AppRole(val nombreDb: String) {
    ADMINISTRADOR("Administrador"),
    BIOLOGO("Biólogo"),
    VETERINARIO("Veterinario"),
    PATOLOGO("Patólogo"),
    CUIDADOR("Cuidador");

    companion object {
        fun from(value: String?): AppRole? = entries.find {
            it.nombreDb.equals(value, ignoreCase = true)
        }
    }
}

fun Route.authorized(vararg allowedRoles: AppRole, build: Route.() -> Unit) {
    authenticate {
        //interceptor for each petition
        intercept(ApplicationCallPipeline.Call) {
            val principal = call.principal<JWTPrincipal>()
            val roleClaim = principal?.payload?.getClaim("role")?.asString()
            val userRole = AppRole.from(roleClaim)

            if (userRole == null || !allowedRoles.contains(userRole)) {
                call.respond(
                    HttpStatusCode.Forbidden, mapOf(
                        "error" to "Acceso Denegado",
                        "message" to "Tu rol '${userRole ?: "Desconocido"}' no tiene permiso para esta acción."
                    )
                )
                finish()
            }
        }

        build()
    }
}