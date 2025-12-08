package com.hugin_munin.api.infrastructure.api.routes

import com.hugin_munin.api.application.services.ReporteService
import com.hugin_munin.api.infrastructure.api.dto.ReporteRequest
import com.hugin_munin.api.infrastructure.api.dto.ReporteUpdateRequest
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.reporteRouting(reporteService: ReporteService) {
    route("/reportes") {

        get {
            val reportes = reporteService.getAllReportes()
            call.respond(HttpStatusCode.OK, reportes)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "ID inválido")

            val reporte = reporteService.getReporteById(id)
            if (reporte != null) {
                call.respond(HttpStatusCode.OK, reporte)
            } else {
                call.respond(HttpStatusCode.NotFound, "Reporte no encontrado")
            }
        }

        get("/especimen/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "ID de espécimen inválido")

            val reportes = reporteService.getReportesByEspecimen(id)
            call.respond(HttpStatusCode.OK, reportes)
        }

        post {
            try {
                val request = call.receive<ReporteRequest>()
                val created = reporteService.createReporte(request)
                call.respond(HttpStatusCode.Created, created)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Error al crear reporte: ${e.message}")
            }
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest, "ID inválido")

            try {
                val request = call.receive<ReporteUpdateRequest>()
                val updated = reporteService.updateReporte(id, request)
                if (updated != null) {
                    call.respond(HttpStatusCode.OK, updated)
                } else {
                    call.respond(HttpStatusCode.NotFound, "Reporte no encontrado")
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Error al actualizar: ${e.message}")
            }
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "ID inválido")

            val deleted = reporteService.deleteReporte(id)
            if (deleted) {
                call.respond(HttpStatusCode.NoContent)
            } else {
                call.respond(HttpStatusCode.NotFound, "Reporte no encontrado")
            }
        }
    }
}