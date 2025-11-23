package com.hugin_munin.api.infrastructure.api.routes

import com.hugin_munin.api.application.services.EspecimenService
import com.hugin_munin.api.application.services.EspecimenQueryService
import com.hugin_munin.api.application.services.RegistroAltaService
import com.hugin_munin.api.domain.models.*
import com.hugin_munin.api.domain.ports.EspecimenRepository
import com.hugin_munin.api.infrastructure.api.dto.AltaEspecimenRequest
import com.hugin_munin.api.infrastructure.api.dto.EspecimenUpdateRequest
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.especimenRouting(
    especimenService: EspecimenService,
    especimenQueryService: EspecimenQueryService,
    registroAltaService: RegistroAltaService,
    especimenRepository: EspecimenRepository
) {
    route("/especimen") {

        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "El ID de espécimen no es válido.")

            val detalle = especimenQueryService.getEspecimenDetalleById(id)
            if (detalle != null) {
                call.respond(HttpStatusCode.OK, detalle)
            } else {
                call.respond(HttpStatusCode.NotFound, "Espécimen con ID $id no encontrado.")
            }
        }

        get {
            val detalles = especimenQueryService.getAllEspecimenesDetalle()
            call.respond(HttpStatusCode.OK, detalles)
        }

        post("/alta") {
            val request = call.receive<AltaEspecimenRequest>()

            val especieData = Especie(
                genero = request.genero,
                especie = request.especieNombre
            )

            val especimenData = Especimen(
                numInventario = request.numInventario,
                nombre = request.nombreEspecimen,
                especieId = 0
            )

            val altaData = RegistroAlta(
                especimenId = 0,
                origenAltaId = request.origenAltaId,
                responsableId = request.responsableId,
                fechaIngreso = request.fechaIngreso,
                procedencia = request.procedencia,
                observacion = request.observacionAlta,
                idReporteTraslado = 0
            )

            val trasladoData = ReporteTraslado(
                reporteId = 0,
                areaOrigen = "Externo",
                areaDestino = request.areaDestino,
                ubicacionOrigen = request.ubicacionOrigen,
                ubicacionDestino = request.ubicacionDestino,
                motivo = "Ingreso inicial al centro"
            )

            val nuevoEspecimen = especimenService.registerEspecimen(
                especieData,
                especimenData,
                altaData,
                trasladoData
            )
            call.respond(HttpStatusCode.Created, nuevoEspecimen)
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest, "El ID de espécimen no es válido.")

            val request = call.receive<EspecimenUpdateRequest>()

            val especimenExistente = especimenRepository.findById(id)
                ?: return@put call.respond(HttpStatusCode.NotFound, "Espécimen no encontrado.")

            val registroAlta = registroAltaService.getRegistroByEspecimenId(id)
                ?: return@put call.respond(HttpStatusCode.NotFound, "Registro de alta no encontrado.")

            val especimenActualizado = especimenExistente.copy(
                nombre = request.nombreEspecimen
            )

            especimenRepository.update(id, especimenActualizado)

            val altaActualizada = registroAlta.copy(
                origenAltaId = request.origenAltaId,
                fechaIngreso = request.fechaIngreso,
                procedencia = request.procedencia,
                observacion = request.observacion
            )

            registroAltaService.updateRegistroAlta(registroAlta.id!!, altaActualizada)

            val detalleActualizado = especimenQueryService.getEspecimenDetalleById(id)
            call.respond(HttpStatusCode.OK, detalleActualizado!!)
        }
    }
}