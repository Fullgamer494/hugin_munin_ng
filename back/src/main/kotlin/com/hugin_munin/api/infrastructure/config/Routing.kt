package com.hugin_munin.api.infrastructure.config

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import com.hugin_munin.api.infrastructure.api.routes.especimenRouting
import com.hugin_munin.api.infrastructure.api.routes.registroAltaRouting
import com.hugin_munin.api.infrastructure.api.routes.registroBajaRouting
import com.hugin_munin.api.infrastructure.api.routes.reporteRouting
import com.hugin_munin.api.infrastructure.api.routes.reporteConductualRoutes
import com.hugin_munin.api.application.services.EspecimenService
import com.hugin_munin.api.application.services.EspecimenQueryService
import com.hugin_munin.api.application.services.RegistroAltaService
import com.hugin_munin.api.application.services.RegistroBajaService
import com.hugin_munin.api.application.services.ReporteService
import com.hugin_munin.api.domain.ports.EspecimenRepository
import kotlinx.serialization.Serializable
import org.koin.ktor.ext.inject

@Serializable
data class ErrorResponse(val error: String, val message: String)

fun Application.configureRouting() {
    val especimenService by inject<EspecimenService>()
    val especimenQueryService by inject<EspecimenQueryService>()
    val registroAltaService by inject<RegistroAltaService>()
    val especimenRepository by inject<EspecimenRepository>()
    val registroBajaService by inject<RegistroBajaService>()
    val reporteService by inject<ReporteService>()

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

        route("/hm") {
            especimenRouting(especimenService, especimenQueryService, registroAltaService, especimenRepository)
            registroAltaRouting(registroAltaService)
            registroBajaRouting(registroBajaService)
            reporteRouting(reporteService)
            reporteConductualRoutes()
        }
    }
}