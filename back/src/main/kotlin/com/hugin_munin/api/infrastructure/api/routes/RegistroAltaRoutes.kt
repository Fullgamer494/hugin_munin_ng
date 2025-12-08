package com.hugin_munin.api.infrastructure.api.routes

import com.hugin_munin.api.application.services.RegistroAltaService
import com.hugin_munin.api.domain.models.RegistroAlta
import com.hugin_munin.api.domain.models.ReporteTraslado
import com.hugin_munin.api.infrastructure.api.dto.RegistroAltaRequest
import com.hugin_munin.api.infrastructure.api.dto.RegistroAltaUpdateRequest
import com.hugin_munin.api.infrastructure.api.dto.RegistroAltaResponse
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.registroAltaRouting(registroAltaService: RegistroAltaService) {
    route("/registro-alta") {

        get {
            val registros = registroAltaService.getAllRegistros()
            val responses = registros.map { it.toResponse() }
            call.respond(HttpStatusCode.OK, responses)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "ID inválido")

            val registro = registroAltaService.getRegistroById(id)
            if (registro != null) {
                call.respond(HttpStatusCode.OK, registro.toResponse())
            } else {
                call.respond(HttpStatusCode.NotFound, "Registro de alta no encontrado")
            }
        }

        get("/especimen/{especimenId}") {
            val especimenId = call.parameters["especimenId"]?.toIntOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "ID de especimen inválido")

            val registro = registroAltaService.getRegistroByEspecimenId(especimenId)
            if (registro != null) {
                call.respond(HttpStatusCode.OK, registro.toResponse())
            } else {
                call.respond(HttpStatusCode.NotFound, "Registro de alta no encontrado para el especimen")
            }
        }

        post {
            val request = call.receive<RegistroAltaRequest>()

            val altaData = RegistroAlta(
                especimenId = request.especimenId,
                origenAltaId = request.origenAltaId,
                responsableId = request.responsableId,
                fechaIngreso = request.fechaIngreso,
                procedencia = request.procedencia,
                observacion = request.observacion,
                idReporteTraslado = 0
            )

            val trasladoData = ReporteTraslado(
                reporteId = 0,
                areaOrigen = request.traslado.areaOrigen,
                areaDestino = request.traslado.areaDestino,
                ubicacionOrigen = request.traslado.ubicacionOrigen,
                ubicacionDestino = request.traslado.ubicacionDestino,
                motivo = request.traslado.motivo
            )

            try {
                val nuevoRegistro = registroAltaService.createRegistroAlta(
                    request.especimenId,
                    altaData,
                    trasladoData
                )
                call.respond(HttpStatusCode.Created, nuevoRegistro.toResponse())
            } catch (e: IllegalArgumentException) {
                call.respond(HttpStatusCode.BadRequest, e.message ?: "Error en la solicitud")
            }
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest, "ID inválido")

            val request = call.receive<RegistroAltaUpdateRequest>()

            val existing = registroAltaService.getRegistroById(id)
                ?: return@put call.respond(HttpStatusCode.NotFound, "Registro de alta no encontrado")

            val altaData = existing.copy(
                origenAltaId = request.origenAltaId ?: existing.origenAltaId,
                procedencia = request.procedencia,
                observacion = request.observacion
            )

            val updated = registroAltaService.updateRegistroAlta(id, altaData)
            if (updated != null) {
                call.respond(HttpStatusCode.OK, updated.toResponse())
            } else {
                call.respond(HttpStatusCode.InternalServerError, "Error al actualizar")
            }
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "ID inválido")

            val deleted = registroAltaService.deleteRegistroAlta(id)
            if (deleted) {
                call.respond(HttpStatusCode.NoContent)
            } else {
                call.respond(HttpStatusCode.NotFound, "Registro de alta no encontrado")
            }
        }
    }
}

private fun RegistroAlta.toResponse() = RegistroAltaResponse(
    id = this.id!!,
    especimenId = this.especimenId,
    origenAltaId = this.origenAltaId,
    responsableId = this.responsableId,
    fechaIngreso = this.fechaIngreso,
    procedencia = this.procedencia,
    observacion = this.observacion,
    idReporteTraslado = this.idReporteTraslado
)