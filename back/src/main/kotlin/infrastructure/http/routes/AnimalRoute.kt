package com.hugin_munin.http.routes

import com.hugin_munin.infrastructure.services.*
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Routing.animalRouting(specimenService: SpecimenService) {

    route("/api/species") {
        post {
            try {
                val data = call.receive<SpeciesRequest>()
                val id = specimenService.createSpecies(data)
                call.respond(HttpStatusCode.Created, mapOf("id" to id))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        get {
            try {
                val species = specimenService.getAllSpecies()
                call.respond(HttpStatusCode.OK, species)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))

            try {
                val species = specimenService.getSpeciesById(id)
                if (species != null) {
                    call.respond(HttpStatusCode.OK, species)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Species not found"))
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }
    }

    route("/api/specimens") {

        post {
            try {
                val data = call.receive<SpecimenRequest>()
                val id = specimenService.createSpecimen(data)
                call.respond(HttpStatusCode.Created, mapOf("id" to id))
            } catch (e: IllegalArgumentException) {
                call.respond(HttpStatusCode.Conflict, mapOf("error" to (e.message ?: "Dato duplicado")))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        get {
            try {
                val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 1
                val pageSize = call.request.queryParameters["pageSize"]?.toIntOrNull() ?: 10
                val search = call.request.queryParameters["search"]
                val speciesId = call.request.queryParameters["speciesId"]?.toIntOrNull()
                val gender = call.request.queryParameters["gender"]
                val active = call.request.queryParameters["active"]?.toBooleanStrictOrNull()

                val response = specimenService.getSpecimensPaginated(
                    page = page,
                    pageSize = pageSize,
                    search = search,
                    speciesIdFilter = speciesId,
                    genderFilter = gender,
                    activeFilter = active
                )

                call.respond(HttpStatusCode.OK, response)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Error fetching specimens: ${e.message}"))
            }
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))

            try {
                val specimen = specimenService.getSpecimenById(id)
                if (specimen != null) {
                    call.respond(HttpStatusCode.OK, specimen)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Specimen not found"))
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))

            try {
                val data = call.receive<SpecimenRequest>()
                val updated = specimenService.updateSpecimen(id, data)
                if (updated) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Specimen updated"))
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Specimen not found"))
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))

            try {
                val deleted = specimenService.deleteSpecimen(id)
                if (deleted) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Specimen deleted"))
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Specimen not found"))
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        get("/search") {
            val name = call.request.queryParameters["name"]
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Parameter 'name' required"))

            try {
                val specimens = specimenService.searchByName(name)
                call.respond(HttpStatusCode.OK, specimens)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }
    }
}