package com.hugin_munin

import com.hugin_munin.http.routes.animalRouting
import com.hugin_munin.http.routes.registrationRouting

import com.hugin_munin.infrastructure.data.tables.SpecimenService
import com.hugin_munin.infrastructure.services.RegistrationService
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Application.configureDatabases() {

    val specimenService = SpecimenService()
    val registrationService = RegistrationService()

    routing {
        animalRouting(specimenService)
        registrationRouting(registrationService)
    }
}