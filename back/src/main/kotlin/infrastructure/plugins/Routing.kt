package com.hugin_munin.infrastructure.plugins

import com.hugin_munin.infrastructure.database.DatabaseFactory.dbQuery
import com.hugin_munin.infrastructure.database.tables.Users
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.selectAll

fun Application.configureRouting() {
    routing {
        get("/") {
            call.respondText("Hugin & Munin API - Running")
        }

        get("/health") {
            call.respondText("OK")
        }

        get("/test-db") {
            val userCount = dbQuery {
                Users.selectAll().count()
            }
            call.respondText("Database connected! Users in DB: $userCount")
        }
    }
}