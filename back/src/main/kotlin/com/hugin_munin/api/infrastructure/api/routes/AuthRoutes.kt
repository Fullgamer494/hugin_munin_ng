package com.hugin_munin.api.infrastructure.api.routes

import com.hugin_munin.api.application.services.AuthService
import com.hugin_munin.api.domain.models.LoginRequest
import com.hugin_munin.api.domain.models.RefreshTokenRequest
import com.hugin_munin.api.infrastructure.config.userId
import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.origin
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

fun Route.authRouting(authService: AuthService) {
    route("/auth") {

        // Login - No requiere autenticación
        post("/login") {
            try {
                val loginRequest = call.receive<LoginRequest>()

                // Obtener IP y User-Agent del request
                val ipAddress = call.request.origin.remoteHost
                val userAgent = call.request.headers["User-Agent"]

                val tokenResponse = authService.login(
                    email = loginRequest.correo,
                    password = loginRequest.contrasena,
                    ipAddress = ipAddress,
                    userAgent = userAgent
                )

                if (tokenResponse != null) {
                    call.respond(HttpStatusCode.OK, tokenResponse)
                } else {
                    call.respond(
                        HttpStatusCode.Unauthorized,
                        mapOf("error" to "Credenciales inválidas")
                    )
                }
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Error en la solicitud: ${e.message}")
                )
            }
        }

        // Refresh token - No requiere autenticación JWT (usa refresh token)
        post("/refresh") {
            try {
                val refreshRequest = call.receive<RefreshTokenRequest>()

                val tokenResponse = authService.refreshToken(refreshRequest.refreshToken)

                if (tokenResponse != null) {
                    call.respond(HttpStatusCode.OK, tokenResponse)
                } else {
                    call.respond(
                        HttpStatusCode.Unauthorized,
                        mapOf("error" to "Refresh token inválido o expirado")
                    )
                }
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Error en la solicitud: ${e.message}")
                )
            }
        }

        // Rutas protegidas con JWT
        authenticate("auth-jwt") {

            // Logout - Revoca el refresh token actual
            post("/logout") {
                try {
                    val refreshRequest = call.receive<RefreshTokenRequest>()

                    val success = authService.logout(refreshRequest.refreshToken)

                    if (success) {
                        call.respond(
                            HttpStatusCode.OK,
                            mapOf("message" to "Sesión cerrada exitosamente")
                        )
                    } else {
                        call.respond(
                            HttpStatusCode.BadRequest,
                            mapOf("error" to "No se pudo cerrar la sesión")
                        )
                    }
                } catch (e: Exception) {
                    call.respond(
                        HttpStatusCode.BadRequest,
                        mapOf("error" to "Error en la solicitud: ${e.message}")
                    )
                }
            }

            // Logout de todas las sesiones
            post("/logout-all") {
                try {
                    val userId = call.userId

                    val success = authService.logoutAllSessions(userId)

                    if (success) {
                        call.respond(
                            HttpStatusCode.OK,
                            mapOf("message" to "Todas las sesiones fueron cerradas")
                        )
                    } else {
                        call.respond(
                            HttpStatusCode.BadRequest,
                            mapOf("error" to "No se pudieron cerrar las sesiones")
                        )
                    }
                } catch (e: Exception) {
                    call.respond(
                        HttpStatusCode.InternalServerError,
                        mapOf("error" to "Error al cerrar sesiones: ${e.message}")
                    )
                }
            }

            // Obtener información del usuario actual
            get("/me") {
                try {
                    val userId = call.userId

                    val user = authService.getCurrentUser(userId)

                    if (user != null) {
                        call.respond(
                            HttpStatusCode.OK,
                            UserInfoResponse(
                                id = user.id,
                                nombreUsuario = user.nombreUsuario,
                                correo = user.correo,
                                rol = user.rolNombre,
                                permisos = user.permisos
                            )
                        )
                    } else {
                        call.respond(
                            HttpStatusCode.NotFound,
                            mapOf("error" to "Usuario no encontrado")
                        )
                    }
                } catch (e: Exception) {
                    call.respond(
                        HttpStatusCode.InternalServerError,
                        mapOf("error" to "Error al obtener información del usuario: ${e.message}")
                    )
                }
            }
        }
    }
}

@Serializable
data class UserInfoResponse(
    val id: Int,
    val nombreUsuario: String,
    val correo: String,
    val rol: String,
    val permisos: List<String>
)