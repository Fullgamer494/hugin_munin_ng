package com.hugin_munin

import com.hugin_munin.infrastructure.database.DatabaseFactory
import com.hugin_munin.infrastructure.plugins.*
import io.ktor.server.application.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    DatabaseFactory.init(environment)

    configureSerialization()
    configureHTTP()
    configureMonitoring()
    configureStatusPages()
    configureSecurity()
    configureRouting()
    configureDatabases()
}