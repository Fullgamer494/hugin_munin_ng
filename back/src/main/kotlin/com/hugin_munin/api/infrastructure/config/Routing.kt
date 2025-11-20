package com.hugin_munin.api.infrastructure.config

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.auth.*  // ⬅️ NUEVO
import com.hugin_munin.api.infrastructure.api.routes.*
import com.hugin_munin.api.application.services.*
import com.hugin_munin.api.domain.ports.EspecimenRepository
import kotlinx.serialization.Serializable
import org.koin.ktor.ext.inject

@Serializable
data class ErrorResponse(val error: String, val message: String)

fun Application.configureRouting() {
    // Inyectar servicios
    val authService by inject<AuthService>()  // ⬅️ NUEVO
    val especimenService by inject<EspecimenService>()
    val especimenQueryService by inject<EspecimenQueryService>()
    val registroAltaService by inject<RegistroAltaService>()
    val especimenRepository by inject<EspecimenRepository>()
    val registroBajaService by inject<RegistroBajaService>()
    val reporteService by inject<ReporteService>()
    val trasladoService by inject<TrasladoService>()

    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.respond(
                HttpStatusCode.InternalServerError,
                ErrorResponse("Internal Server Error", cause.message ?: "Error desconocido")
            )
        }
    }

    routing {
        get("/") { call.respondText("Hello World!") }
        get("/health") { call.respond(mapOf("status" to "OK")) }

        // Rutas no protegidas (autenticación)
        authRouting(authService)

        // Rutas protegidas con JWT
        authenticate("auth-jwt") {
            route("/hm") {
                especimenRouting(especimenService, especimenQueryService, registroAltaService, especimenRepository)
                registroAltaRouting(registroAltaService)
                registroBajaRouting(registroBajaService)
                reporteRouting(reporteService)
                trasladoRouting(trasladoService)
            }
        }
    }
}