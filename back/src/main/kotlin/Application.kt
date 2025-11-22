package com.hugin_munin

import com.hugin_munin.infrastructure.database.DatabaseFactory
import com.hugin_munin.infrastructure.plugins.*
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.*

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