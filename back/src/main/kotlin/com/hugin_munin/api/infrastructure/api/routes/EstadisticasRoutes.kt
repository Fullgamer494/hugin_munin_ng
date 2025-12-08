package com.hugin_munin.api.infrastructure.api.routes

import com.hugin_munin.api.application.services.EstadisticasService
import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.estadisticasRouting(estadisticasService: EstadisticasService) {
    route("/estadisticas") {
        get {
            try {
                val estadisticas = estadisticasService.obtenerEstadisticas()
                call.respond(HttpStatusCode.OK, estadisticas)
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error al obtener estadísticas: ${e.message}")
                )
            }
        }
    }
}