package com.hugin_munin.infrastructure.http.routes

import com.hugin_munin.infrastructure.services.*
import com.hugin_munin.infrastructure.plugins.AppRole
import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Routing.reportRouting(reportService: ReportService) {

    route("/hm/reportes") {
        authenticate {

            get("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull()
                if (id == null) {
                    call.respond(HttpStatusCode.BadRequest, "ID inválido")
                    return@get
                }
                val report = reportService.getReportById(id)
                if (report != null) call.respond(report)
                else call.respond(HttpStatusCode.NotFound)
            }

            get("/especimen/{id}") {
                val id = call.parameters["id"]?.toIntOrNull()
                if (id == null) {
                    call.respond(HttpStatusCode.BadRequest, "ID de espécimen inválido")
                    return@get
                }
                val reports = reportService.getReportsBySpecimen(id)
                call.respond(reports)
            }

            post {
                val principal = call.principal<JWTPrincipal>()
                val roleClaim = principal?.payload?.getClaim("role")?.asString()
                val userRole = AppRole.from(roleClaim)

                val data = call.receive<ReportRequest>()

                val isAuthorized = when (data.id_tipo_reporte) {
                    1 -> userRole == AppRole.VETERINARIO
                    2 -> userRole == AppRole.BIOLOGO
                    3 -> userRole == AppRole.VETERINARIO
                    4 -> userRole == AppRole.PATOLOGO
                    5 -> userRole == AppRole.BIOLOGO || userRole == AppRole.ADMINISTRADOR
                    else -> false
                }

                if (!isAuthorized) {
                    call.respond(HttpStatusCode.Forbidden, mapOf("error" to "Tu rol no permite crear este tipo de reporte"))
                    return@post
                }

                try {
                    val id = reportService.createReport(data)
                    call.respond(HttpStatusCode.Created, mapOf("id" to id))
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.InternalServerError, mapOf("error" to e.localizedMessage))
                }
            }

            delete("/{id}") {
                val principal = call.principal<JWTPrincipal>()
                val roleClaim = principal?.payload?.getClaim("role")?.asString()

                if (AppRole.from(roleClaim) != AppRole.ADMINISTRADOR) {
                    call.respond(HttpStatusCode.Forbidden, "Solo administradores pueden eliminar reportes")
                    return@delete
                }

                val id = call.parameters["id"]?.toIntOrNull()
                if (id != null && reportService.deleteReport(id)) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Reporte eliminado"))
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }
    }
}