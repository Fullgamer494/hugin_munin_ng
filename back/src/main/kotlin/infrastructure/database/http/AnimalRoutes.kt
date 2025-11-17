package com.hugin_munin.http.routes

import com.hugin_munin.infrastructure.database.tables.AnimalService
import com.hugin_munin.infrastructure.database.tables.EspecieData
import com.hugin_munin.infrastructure.database.tables.EspecimenData
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Routing.animalRouting(animalService: AnimalService) {

    // POST /species
    post("/species") {
        val data = call.receive<EspecieData>()
        val id = animalService.createEspecie(data)
        call.respond(HttpStatusCode.Created, mapOf("id" to id))
    }

    route("/animals") {

        // POST /animals
        post {
            val especimen = call.receive<EspecimenData>()
            val id = animalService.createEspecimen(especimen)
            call.respond(HttpStatusCode.Created, mapOf("id" to id))
        }

        // GET /animals
        get {
            val animals = animalService.readAll()
            call.respond(HttpStatusCode.OK, animals)
        }


        route("/{id}") {

            // GET /animals/{id}
            get {
                val id = call.parameters["id"]?.toIntOrNull()
                    ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID format"))

                val animal = animalService.read(id)
                if (animal != null) {
                    call.respond(HttpStatusCode.OK, animal)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Animal not found"))
                }
            }

            // PUT /animals/{id}
            put {
                val id = call.parameters["id"]?.toIntOrNull()
                    ?: return@put call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID format"))

                val animal = call.receive<EspecimenData>()
                animalService.updateEspecimen(id, animal)
                call.respond(HttpStatusCode.OK, mapOf("message" to "Animal updated successfully"))
            }

            // DELETE /animals/{id}
            delete {
                val id = call.parameters["id"]?.toIntOrNull()
                    ?: return@delete call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID format"))

                animalService.delete(id)
                call.respond(HttpStatusCode.OK, mapOf("message" to "Animal deleted successfully"))
            }
        }

        get("/search") {
            val name = call.request.queryParameters["name"]
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Name parameter required"))
            val animals = animalService.searchByName(name)
            call.respond(HttpStatusCode.OK, animals)
        }

        get("/filter/species/{species}") {
            val species = call.parameters["species"]
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Species required"))
            val animals = animalService.filterBySpecies(species)
            call.respond(HttpStatusCode.OK, animals)
        }

        get("/filter/common-name/{name}") {
            val name = call.parameters["name"]
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Common name required"))
            val animals = animalService.filterByCommonName(name)
            call.respond(HttpStatusCode.OK, animals)
        }
    }
}