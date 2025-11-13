package com.hugin_munin.infrastructure.plugins

import com.hugin_munin.infrastructure.database.DatabaseFactory.dbQuery
import com.hugin_munin.infrastructure.database.tables.Users
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.selectAll
import com.hugin_munin.routes.authRoutes
import io.ktor.server.auth.*

fun Application.configureRouting() {
    routing {
        get("/") {
            call.respondText("Hugin & Munin API - Running")
        }

        get("/health") {
            call.respondText("OK")
        }

        authRoutes()

        get("/test-db") {
            val userCount = dbQuery {
                Users.selectAll().count()
            }
            call.respondText("Database connected! Users in DB: $userCount")
        }


        // 1. USER MANAGEMENT
        // Only Administrator can create/delete users
        authorized(AppRole.ADMINISTRADOR) {
            get("/test-db") { // Existing protected example
                val userCount = dbQuery { Users.selectAll().count() }
                call.respondText("Database connected! Users in DB: $userCount")
            }

            post("/users") { call.respondText("User created (Admin only)") }
            delete("/users/{id}") { call.respondText("User deleted (Admin only)") }
        }

        // 2. SPECIMEN MANAGEMENT (Registration and Editing)
        // Admin (Director) and Biologist can register and edit basic info
        authorized(AppRole.ADMINISTRADOR, AppRole.BIOLOGO) {
            post("/specimens") { call.respondText("Specimen registered") }
            put("/specimens/{id}") { call.respondText("Specimen info updated") }
        }

        // 3. DEREGISTRATIONS AND DELETION
        // Admin permanently deletes pathologist deregisters due to death.
        authorized(AppRole.ADMINISTRADOR, AppRole.PATOLOGO) {
            put("/specimens/{id}/deregister") { call.respondText("Specimen deregistered (Logical delete)") }
        }
        // Only Admin can perform hard delete
        authorized(AppRole.ADMINISTRADOR) {
            delete("/specimens/{id}") { call.respondText("Specimen deleted PERMANENTLY") }
        }

        // 4. CLINICAL REPORTS
        // Exclusive to Veterinarians (Not even Admin can access)
        authorized(AppRole.VETERINARIO) {
            post("/reports/clinical") { call.respondText("Clinical report created") }
            post("/diets") { call.respondText("Diet assigned") }
        }

        // 5. BEHAVIORAL REPORTS
        // Exclusive to Biologists
        authorized(AppRole.BIOLOGO) {
            post("/reports/behavioral") { call.respondText("Behavioral report created") }
        }

        // 6. GENERAL QUERY
        //Everyone (including Caretaker( can view basic info
        authenticate { // Only requires being logged in, regardless of role
            get("/specimens") { call.respondText("List of animals (Visible to all logged-in users)") }
        }
    }
}