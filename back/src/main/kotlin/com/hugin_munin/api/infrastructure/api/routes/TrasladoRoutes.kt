package com.hugin_munin.api.infrastructure.api.routes

import com.hugin_munin.api.application.services.TrasladoService
import com.hugin_munin.api.infrastructure.api.dto.TrasladoRequest
import com.hugin_munin.api.infrastructure.api.dto.TrasladoUpdateRequest
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.trasladoRouting(trasladoService: TrasladoService) {
    route("/reportes/traslado") {

        get {
            try {
                val traslados = trasladoService.getAllTraslados()
                call.respond(HttpStatusCode.OK, traslados)
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error al obtener traslados", "message" to e.message)
                )
            }
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@get call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "ID inválido")
                )

            try {
                val traslado = trasladoService.getTrasladoById(id)
                if (traslado != null) {
                    call.respond(HttpStatusCode.OK, traslado)
                } else {
                    call.respond(
                        HttpStatusCode.NotFound,
                        mapOf("error" to "Traslado no encontrado")
                    )
                }
            } catch (e: IllegalArgumentException) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to e.message))
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error al obtener traslado", "message" to e.message)
                )
            }
        }

        post {
            try {
                val request = call.receive<TrasladoRequest>()
                val nuevoTraslado = trasladoService.createTraslado(request)
                call.respond(HttpStatusCode.Created, nuevoTraslado)
            } catch (e: IllegalArgumentException) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to e.message)
                )
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error al crear traslado", "message" to e.message)
                )
            }
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@put call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "ID inválido")
                )

            try {
                val request = call.receive<TrasladoUpdateRequest>()
                val trasladoActualizado = trasladoService.updateTraslado(id, request)

                if (trasladoActualizado != null) {
                    call.respond(HttpStatusCode.OK, trasladoActualizado)
                } else {
                    call.respond(
                        HttpStatusCode.NotFound,
                        mapOf("error" to "Traslado no encontrado")
                    )
                }
            } catch (e: IllegalArgumentException) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to e.message)
                )
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error al actualizar traslado", "message" to e.message)
                )
            }
        }
    }
}