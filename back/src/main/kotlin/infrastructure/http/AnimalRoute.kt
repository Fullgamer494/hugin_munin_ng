package com.hugin_munin.http.routes

import com.hugin_munin.infrastructure.data.tables.*
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Routing.animalRouting(specimenService: SpecimenService) {

    // ========== ESPECIES ==========
    route("/api/especies") {

        // POST /api/especies
        post {
            try {
                val data = call.receive<EspecieRequest>()
                val id = specimenService.createEspecie(data)
                call.respond(HttpStatusCode.Created, mapOf("id" to id))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        // GET /api/especies
        get {
            try {
                val especies = specimenService.getAllEspecies()
                call.respond(HttpStatusCode.OK, especies)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        // GET /api/especies/{id}
        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))

            try {
                val especie = specimenService.getEspecieById(id)
                if (especie != null) {
                    call.respond(HttpStatusCode.OK, especie)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Especie no encontrada"))
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }
    }

    // ========== ESPECÍMENES ==========
    route("/api/especimenes") {

        // POST /api/especimenes
        post {
            try {
                val data = call.receive<EspecimenRequest>()
                val id = specimenService.createEspecimen(data)
                call.respond(HttpStatusCode.Created, mapOf("id" to id))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        // GET /api/especimenes
        get {
            try {
                val especimenes = specimenService.getAllEspecimenes()
                call.respond(HttpStatusCode.OK, especimenes)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        // GET /api/especimenes/{id}
        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))

            try {
                val especimen = specimenService.getEspecimenById(id)
                if (especimen != null) {
                    call.respond(HttpStatusCode.OK, especimen)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Espécimen no encontrado"))
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        // PUT /api/especimenes/{id}
        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))

            try {
                val data = call.receive<EspecimenRequest>()
                specimenService.updateEspecimen(id, data)
                call.respond(HttpStatusCode.OK, mapOf("message" to "Espécimen actualizado"))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        // DELETE /api/especimenes/{id}
        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))

            try {
                specimenService.deleteEspecimen(id)
                call.respond(HttpStatusCode.OK, mapOf("message" to "Espécimen eliminado"))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        // GET /api/especimenes/search
        get("/search") {
            val name = call.request.queryParameters["name"]
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Parámetro 'name' requerido"))

            try {
                val especimenes = specimenService.searchByName(name)
                call.respond(HttpStatusCode.OK, especimenes)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        // GET /api/especimenes/filter/species
        get("/filter/species") {
            val name = call.request.queryParameters["name"]
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Parámetro 'name' requerido"))

            try {
                val especimenes = specimenService.filterBySpecies(name)
                call.respond(HttpStatusCode.OK, especimenes)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }

        // GET /api/especimenes/filter/common
        get("/filter/common-name") {
            val name = call.request.queryParameters["name"]
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Parámetro 'name' requerido"))

            try {
                val especimenes = specimenService.filterByCommonName(name)
                call.respond(HttpStatusCode.OK, especimenes)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.message))
            }
        }
    }
}