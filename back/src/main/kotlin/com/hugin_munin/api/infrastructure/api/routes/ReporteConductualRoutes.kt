package com.hugin_munin.api.infrastructure.api.routes

import com.hugin_munin.api.application.services.ReporteConductualService
import com.hugin_munin.api.domain.models.ReporteConductual
import com.hugin_munin.api.infrastructure.api.dto.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.datetime.LocalDate
import org.koin.ktor.ext.inject

fun Route.reporteConductualRoutes() {
    val service by inject<ReporteConductualService>()

    route("/reportes-conductuales") {
        post {
            try {
                val request = call.receive<CreateReporteConductualRequest>()
                val reporte = ReporteConductual(
                    idReporte = 0,
                    idEspecimen = request.idEspecimen,
                    idResponsable = request.idResponsable,
                    asunto = request.asunto,
                    fechaReporte = LocalDate.parse(request.fechaReporte),
                    contenido = request.contenido
                )
                val id = service.createReporte(reporte, request.rolUsuario)
                call.respond(HttpStatusCode.Created, mapOf("id" to id))
            } catch (e: IllegalArgumentException) {
                call.respond(HttpStatusCode.BadRequest, MessageResponse(e.message ?: "Error de validación"))
            } catch (e: Exception) {
                e.printStackTrace()
                call.respond(HttpStatusCode.InternalServerError, MessageResponse("Error al crear reporte: ${e.message}"))
            }
        }

        get {
            try {
                val reportes = service.getAllReportes()
                val response = reportes.map {
                    ReporteConductualResponse(
                        idReporte = it.idReporte,
                        idEspecimen = it.idEspecimen,
                        idResponsable = it.idResponsable,
                        asunto = it.asunto,
                        fechaReporte = it.fechaReporte.toString(),
                        contenido = it.contenido
                    )
                }
                call.respond(HttpStatusCode.OK, response)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, MessageResponse("Error al obtener reportes"))
            }
        }

        get("/{id}") {
            try {
                val id = call.parameters["id"]?.toIntOrNull()
                    ?: return@get call.respond(HttpStatusCode.BadRequest, MessageResponse("ID inválido"))

                val reporte = service.getReporte(id)
                    ?: return@get call.respond(HttpStatusCode.NotFound, MessageResponse("Reporte no encontrado"))

                call.respond(HttpStatusCode.OK, ReporteConductualResponse(
                    idReporte = reporte.idReporte,
                    idEspecimen = reporte.idEspecimen,
                    idResponsable = reporte.idResponsable,
                    asunto = reporte.asunto,
                    fechaReporte = reporte.fechaReporte.toString(),
                    contenido = reporte.contenido
                ))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, MessageResponse("Error al obtener reporte"))
            }
        }

        get("/especimen/{idEspecimen}") {
            try {
                val idEspecimen = call.parameters["idEspecimen"]?.toIntOrNull()
                    ?: return@get call.respond(HttpStatusCode.BadRequest, MessageResponse("ID de espécimen inválido"))

                val reportes = service.getReportesByEspecimen(idEspecimen)
                val response = reportes.map {
                    ReporteConductualResponse(
                        idReporte = it.idReporte,
                        idEspecimen = it.idEspecimen,
                        idResponsable = it.idResponsable,
                        asunto = it.asunto,
                        fechaReporte = it.fechaReporte.toString(),
                        contenido = it.contenido
                    )
                }
                call.respond(HttpStatusCode.OK, response)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, MessageResponse("Error al obtener reportes"))
            }
        }

        put("/{id}") {
            try {
                val id = call.parameters["id"]?.toIntOrNull()
                    ?: return@put call.respond(HttpStatusCode.BadRequest, MessageResponse("ID inválido"))

                val request = call.receive<UpdateReporteConductualRequest>()
                val reporte = ReporteConductual(
                    idReporte = id,
                    idEspecimen = request.idEspecimen,
                    idResponsable = request.idResponsable,
                    asunto = request.asunto,
                    fechaReporte = LocalDate.parse(request.fechaReporte),
                    contenido = request.contenido
                )

                val updated = service.updateReporte(id, reporte, request.rolUsuario)
                if (updated) {
                    call.respond(HttpStatusCode.OK, MessageResponse("Reporte actualizado"))
                } else {
                    call.respond(HttpStatusCode.NotFound, MessageResponse("Reporte no encontrado"))
                }
            } catch (e: IllegalArgumentException) {
                call.respond(HttpStatusCode.BadRequest, MessageResponse(e.message ?: "Error de validación"))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, MessageResponse("Error al actualizar reporte"))
            }
        }

        delete("/{id}") {
            try {
                val id = call.parameters["id"]?.toIntOrNull()
                    ?: return@delete call.respond(HttpStatusCode.BadRequest, MessageResponse("ID inválido"))

                val rolUsuario = call.request.queryParameters["rolUsuario"]?.toIntOrNull()
                    ?: return@delete call.respond(HttpStatusCode.BadRequest, MessageResponse("Rol de usuario requerido"))

                val deleted = service.deleteReporte(id, rolUsuario)
                if (deleted) {
                    call.respond(HttpStatusCode.OK, MessageResponse("Reporte eliminado"))
                } else {
                    call.respond(HttpStatusCode.NotFound, MessageResponse("Reporte no encontrado"))
                }
            } catch (e: IllegalArgumentException) {
                call.respond(HttpStatusCode.Forbidden, MessageResponse(e.message ?: "No autorizado"))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, MessageResponse("Error al eliminar reporte"))
            }
        }
    }
}