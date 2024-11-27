package com.hugin_munin.api.infrastructure.api.routes

import com.hugin_munin.api.application.services.ReporteService
import com.hugin_munin.api.infrastructure.api.dto.ReporteRequest
import com.hugin_munin.api.infrastructure.api.dto.ReporteUpdateRequest
import com.hugin_munin.api.infrastructure.config.userPermissions
import com.hugin_munin.api.infrastructure.middleware.requirePermission
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
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))

            val reporte = reporteService.getReporteById(id)
            if (reporte != null) {
                call.respond(HttpStatusCode.OK, reporte)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Reporte no encontrado"))
            }
        }

        get("/especimen/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID de espécimen inválido"))

            val reportes = reporteService.getReportesByEspecimen(id)
            call.respond(HttpStatusCode.OK, reportes)
        }

        post {
            try {
                val request = call.receive<ReporteRequest>()

                val permisoRequerido = when (request.tipoReporteId) {
                    1 -> "generar_reporte_clinico"
                    2 -> "generar_reporte_conductual"
                    3 -> "generar_reporte_alimenticio"
                    4 -> "generar_reporte_defuncion"
                    5 -> "generar_reporte_traslado"
                    else -> {
                        call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Tipo de reporte inválido"))
                        return@post
                    }
                }

                call.requirePermission(permisoRequerido)

                val created = reporteService.createReporte(request)
                call.respond(HttpStatusCode.Created, created)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Error al crear reporte: ${e.message}"))
            }
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))

            try {
                val request = call.receive<ReporteUpdateRequest>()

                val reporteExistente = reporteService.getReporteById(id)
                if (reporteExistente == null) {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Reporte no encontrado"))
                    return@put
                }

                val permisoRequerido = when (reporteExistente.tipoReporteId) {
                    1 -> "editar_reporte_clinico"
                    2 -> "editar_reporte_conductual"
                    3 -> "editar_reporte_alimenticio"
                    4 -> "editar_reporte_defuncion"
                    5 -> "editar_reporte_traslado"
                    else -> {
                        call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Tipo de reporte inválido"))
                        return@put
                    }
                }

                call.requirePermission(permisoRequerido)

                val updated = reporteService.updateReporte(id, request)
                if (updated != null) {
                    call.respond(HttpStatusCode.OK, updated)
                } else {
                    call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Error al actualizar"))
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Error al actualizar: ${e.message}"))
            }
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))

            try {
                val reporteExistente = reporteService.getReporteById(id)
                if (reporteExistente == null) {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Reporte no encontrado"))
                    return@delete
                }

                val permisoRequerido = when (reporteExistente.tipoReporteId) {
                    1 -> "eliminar_reporte_clinico"
                    2 -> "eliminar_reporte_conductual"
                    3 -> "eliminar_reporte_alimenticio"
                    4 -> "eliminar_reporte_defuncion"
                    5 -> "eliminar_reporte_traslado"
                    else -> {
                        call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Tipo de reporte inválido"))
                        return@delete
                    }
                }

                call.requirePermission(permisoRequerido)

                val deleted = reporteService.deleteReporte(id)
                if (deleted) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Reporte no encontrado"))
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Error al eliminar: ${e.message}"))
            }
        }
    }
}