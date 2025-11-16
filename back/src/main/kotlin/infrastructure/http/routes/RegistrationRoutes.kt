package com.hugin_munin.http.routes

import com.hugin_munin.infrastructure.services.*
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Routing.registrationRouting(registrationService: RegistrationService) {

    route("/api/registrations") {
        post {
            try {
                val data = call.receive<RegistrationRequest>()
                val id = registrationService.createRegistration(data)
                call.respond(HttpStatusCode.Created, mapOf("id" to id))
            } catch (e: IllegalArgumentException) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to (e.message ?: "Validation error"))
                )
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Internal server error: ${e.message}")
                )
            }
        }

        get {
            try {
                val registrations = registrationService.getAllRegistrations()
                call.respond(HttpStatusCode.OK, registrations)
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error fetching registrations: ${e.message}")
                )
            }
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@get call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Invalid ID")
                )

            try {
                val registration = registrationService.getRegistrationById(id)
                if (registration != null) {
                    call.respond(HttpStatusCode.OK, registration)
                } else {
                    call.respond(
                        HttpStatusCode.NotFound,
                        mapOf("error" to "Registration not found")
                    )
                }
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error fetching registration: ${e.message}")
                )
            }
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@put call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Invalid ID")
                )

            try {
                val data = call.receive<RegistrationRequest>()
                val updated = registrationService.updateRegistration(id, data)

                if (updated) {
                    call.respond(
                        HttpStatusCode.OK,
                        mapOf("message" to "Registration updated successfully")
                    )
                } else {
                    call.respond(
                        HttpStatusCode.NotFound,
                        mapOf("error" to "Registration not found")
                    )
                }
            } catch (e: IllegalArgumentException) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to (e.message ?: "Validation error"))
                )
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error updating registration: ${e.message}")
                )
            }
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@delete call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Invalid ID")
                )

            try {
                val deleted = registrationService.deleteRegistration(id)

                if (deleted) {
                    call.respond(
                        HttpStatusCode.OK,
                        mapOf("message" to "Registration deleted successfully")
                    )
                } else {
                    call.respond(
                        HttpStatusCode.NotFound,
                        mapOf("error" to "Registration not found")
                    )
                }
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error deleting registration: ${e.message}")
                )
            }
        }
    }

    route("/api/deregistrations") {
        post {
            try {
                val data = call.receive<DeregistrationRequest>()
                val id = registrationService.createDeregistration(data)
                call.respond(HttpStatusCode.Created, mapOf("id" to id))
            } catch (e: IllegalArgumentException) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to (e.message ?: "Validation error"))
                )
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Internal server error: ${e.message}")
                )
            }
        }

        get {
            try {
                val deregistrations = registrationService.getAllDeregistrations()
                call.respond(HttpStatusCode.OK, deregistrations)
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Error fetching deregistrations: ${e.message}")
                )
            }
        }
    }
}