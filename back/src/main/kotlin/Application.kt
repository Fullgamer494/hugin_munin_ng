package com.hugin_munin

import com.hugin_munin.infrastructure.database.DatabaseFactory
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.CORS

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    DatabaseFactory.init(environment)

    install(io.ktor.server.plugins.contentnegotiation.ContentNegotiation) {
        json()
    }

    configureSerialization()
    configureHTTP()
    configureMonitoring()
    configureSecurity()


    configureDatabases()

    configureRouting()
}