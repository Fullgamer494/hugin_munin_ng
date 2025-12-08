package com.hugin_munin.api

import com.hugin_munin.api.infrastructure.config.configureRouting
import com.hugin_munin.api.infrastructure.config.configureSerialization
import com.hugin_munin.api.infrastructure.config.configureSecurity  // ⬅️ NUEVO
import com.hugin_munin.api.infrastructure.database.DatabaseFactory
import com.hugin_munin.api.infrastructure.config.appModule
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.CORS
import org.koin.ktor.plugin.Koin

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    DatabaseFactory.init()

    install(Koin) {
        modules(appModule)
    }

    install(CORS) {

        // 1. Orígenes (Hosts) permitidos
        // **Hardcodeado para el frontend de desarrollo:**
        allowHost("localhost:4200", schemes = listOf("http"))

        // Opcional: Si tienes un dominio de producción
        // allowHost("tudominiofrontend.com", schemes = listOf("https"))

        // 2. Métodos HTTP permitidos
        allowMethod(HttpMethod.Options) // Necesario para peticiones "pre-vuelo" de CORS
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)

        // 3. Cabeceras permitidas
        // Permite enviar cabeceras comunes de contenido y autenticación
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
    }

    configureSecurity()
    configureSerialization()
    configureRouting()
}