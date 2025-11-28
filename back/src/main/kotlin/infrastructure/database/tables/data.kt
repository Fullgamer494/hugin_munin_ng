package com.hugin_munin.infrastructure.database.tables

import com.hugin_munin.infrastructure.http.routes.animalRouting
import com.hugin_munin.http.routes.registrationRouting
import com.hugin_munin.infrastructure.services.SpecimenService
import com.hugin_munin.infrastructure.services.RegistrationService
import io.ktor.server.application.*
import io.ktor.server.routing.*
import com.hugin_munin.infrastructure.http.routes.reportRouting
import com.hugin_munin.infrastructure.services.ReportService

fun Application.configureDatabases() {
    val specimenService = SpecimenService()
    val registrationService = RegistrationService()
    val reportService = ReportService()

    routing {
        animalRouting(specimenService)
        registrationRouting(registrationService)
        reportRouting(reportService)
    }
}