package com.hugin_munin.api

import com.hugin_munin.api.infrastructure.config.configureRouting
import com.hugin_munin.api.infrastructure.config.configureSerialization
import com.hugin_munin.api.infrastructure.database.DatabaseFactory
import com.hugin_munin.api.infrastructure.config.appModule
import io.ktor.server.application.*
import org.koin.ktor.plugin.Koin

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    DatabaseFactory.init(environment)

    install(Koin) {
        modules(appModule)
    }
    configureSerialization()
    configureRouting()
}