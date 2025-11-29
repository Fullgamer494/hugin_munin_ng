package com.hugin_munin.api.infrastructure.database

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction

object DatabaseFactory {
    private lateinit var dataSource: HikariDataSource

    fun init(environment: ApplicationEnvironment) {
        val config = HikariConfig().apply {
            driverClassName = environment.config.property("database.driver").getString()
            jdbcUrl = environment.config.property("database.url").getString()
            username = environment.config.property("database.user").getString()
            password = environment.config.property("database.password").getString()
            maximumPoolSize = environment.config.property("database.maxPoolSize").getString().toInt()
            validate()
        }
        dataSource = HikariDataSource(config)
        Database.connect(dataSource)
    }

    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction { block() }

    fun close() {
        if (::dataSource.isInitialized && !dataSource.isClosed) {
            dataSource.close()
        }
    }
}