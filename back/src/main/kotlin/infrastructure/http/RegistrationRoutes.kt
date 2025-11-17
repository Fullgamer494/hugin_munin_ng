package com.hugin_munin.http.routes

import com.hugin_munin.infrastructure.services.RegistroAltaRequest
import com.hugin_munin.infrastructure.services.RegistrationService
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Routing.registrationRouting(registrationService: RegistrationService) {

    route("/api/registro-alta") {

        // POST /api/registro-alta
        post {
            try {
                val data = call.receive<RegistroAltaRequest>()


                if (data.idEspecie != null && data.idEspecie <= 0) {
                    return@post call.respond(
                        HttpStatusCode.BadRequest,
                        mapOf("error" to "El ID de especie es obligatorio")
                    )
                }

                if (data.idOrigenAlta <= 0) {
                    return@post call.respond(
                        HttpStatusCode.BadRequest,
                        mapOf("error" to "El ID de origen es obligatorio")
                    )
                }

                if (data.idResponsable <= 0) {
                    return@post call.respond(
                        HttpStatusCode.BadRequest,
                        mapOf("error" to "El ID de usuario es obligatorio")
                    )
                }


                try {
                    java.time.LocalDate.parse(data.fechaIngreso)
                } catch (e: Exception) {
                    return@post call.respond(
                        HttpStatusCode.BadRequest,
                        mapOf("error" to "Formato de fecha inválido. Use YYYY-MM-DD")
                    )
                }

                val registration = registrationService.createRegistroAlta(data)
                call.respond(HttpStatusCode.Created, registration)

            } catch (e: IllegalArgumentException) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to (e.message ?: "Error de validación"))
                )
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error interno del servidor: ${e.message}")
                )
            }
        }


        get {
            try {
                val registrations = registrationService.getAllRegistrosAlta()
                call.respond(HttpStatusCode.OK, registrations)
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error al obtener registros: ${e.message}")
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
                val registration = registrationService.getRegistroAltaById(id)
                if (registration != null) {
                    call.respond(HttpStatusCode.OK, registration)
                } else {
                    call.respond(
                        HttpStatusCode.NotFound,
                        mapOf("error" to "Registro no encontrado")
                    )
                }
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error al obtener registro: ${e.message}")
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
                val data = call.receive<RegistroAltaRequest>()
                val updated = registrationService.updateRegistroAlta(id, data)

                if (updated) {
                    call.respond(
                        HttpStatusCode.OK,
                        mapOf("message" to "Registro actualizado correctamente")
                    )
                } else {
                    call.respond(
                        HttpStatusCode.NotFound,
                        mapOf("error" to "Registro no encontrado")
                    )
                }
            } catch (e: IllegalArgumentException) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to (e.message ?: "Error de validación"))
                )
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error al actualizar registro: ${e.message}")
                )
            }
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@delete call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "ID inválido")
                )

            try {
                val deleted = registrationService.deleteRegistroAlta(id)

                if (deleted) {
                    call.respond(
                        HttpStatusCode.OK,
                        mapOf("message" to "Registro eliminado correctamente")
                    )
                } else {
                    call.respond(
                        HttpStatusCode.NotFound,
                        mapOf("error" to "Registro no encontrado")
                    )
                }
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error al eliminar registro: ${e.message}")
                )
            }
        }
    }
}