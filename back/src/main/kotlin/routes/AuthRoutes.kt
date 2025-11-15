package com.hugin_munin.routes

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.hugin_munin.infrastructure.database.DatabaseFactory.dbQuery
import com.hugin_munin.infrastructure.database.tables.Roles
import com.hugin_munin.infrastructure.database.tables.Users
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import java.util.*
import org.jetbrains.exposed.sql.*

// Modelos de datos (DTOs)
@Serializable
data class LoginRequest(val email: String, val password: String)

@Serializable
data class LoginResponse(val token: String, val role: String)

// extend routes from auth
fun Route.authRoutes() {
    route("/auth") { // group under /auth

        post("/login") {
            val credentials = call.receive<LoginRequest>()

            // search user and rol in database
            val userRow = dbQuery {
                (Users innerJoin Roles)
                    .select(Users.id, Users.password, Roles.roleName)
                    .where { Users.email eq credentials.email }
                    .singleOrNull()
            }

            if (userRow != null && userRow[Users.password] == credentials.password) {
                val roleName = userRow[Roles.roleName]
                val userId = userRow[Users.id].value

                // gen token
                val token = JWT.create()
                    .withAudience("jwt-audience")
                    .withIssuer("https://jwt-provider-domain/")
                    .withClaim("id", userId)
                    .withClaim("role", roleName) // rol
                    .withExpiresAt(Date(System.currentTimeMillis() + 3600000)) // 1 hora = 3600000 segundos
                    .sign(Algorithm.HMAC256("secret"))

                call.respond(LoginResponse(token, roleName))
            } else {
                call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Credenciales incorrectas"))
            }
        }
    }
}