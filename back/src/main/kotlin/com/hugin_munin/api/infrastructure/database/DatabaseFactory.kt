package com.hugin_munin.api.infrastructure.database

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource

object DatabaseFactory {
    fun init() {
        val config = HikariConfig().apply {
            val dbHost = System.getenv("DB_HOST") ?: "localhost"
            val dbPort = System.getenv("DB_PORT") ?: "5432"
            val dbName = System.getenv("DB_NAME") ?: "hugin_munin"
            val dbUser = System.getenv("DB_USER") ?: "postgres"
            val dbPassword = System.getenv("DB_PASSWORD") ?: "qwerty123"

            driverClassName = "org.postgresql.Driver"
            jdbcUrl = "jdbc:postgresql://$dbHost:$dbPort/$dbName"
            username = dbUser
            password = dbPassword
            maximumPoolSize = 3
            isAutoCommit = false
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
            validate()
        }
        val dataSource = HikariDataSource(config)
        Database.connect(dataSource)
    }

    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction { block() }
}