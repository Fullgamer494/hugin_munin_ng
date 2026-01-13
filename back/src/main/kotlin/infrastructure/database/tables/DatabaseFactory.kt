package com.hugin_munin.infrastructure.database

import com.hugin_munin.infrastructure.database.tables.*
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.server.application.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

object DatabaseFactory {

    fun init(environment: ApplicationEnvironment) {
        val config = environment.config

        val driver = System.getenv("DATABASE_DRIVER")
            ?: config.property("database.driver").getString()
        val url = System.getenv("DATABASE_URL")
            ?: config.property("database.url").getString()
        val user = System.getenv("DATABASE_USER")
            ?: config.property("database.user").getString()
        val password = System.getenv("DATABASE_PASSWORD")
            ?: config.property("database.password").getString()
        val maxPoolSize = System.getenv("DATABASE_MAX_POOL_SIZE")?.toInt()
            ?: config.propertyOrNull("database.maxPoolSize")?.getString()?.toInt()
            ?: 10

        val hikariConfig = HikariConfig().apply {
            driverClassName = driver
            jdbcUrl = url
            username = user
            this.password = password
            maximumPoolSize = maxPoolSize
            isAutoCommit = false
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
            validate()
        }

        val dataSource = HikariDataSource(hikariConfig)
        Database.connect(dataSource)

        if (config.propertyOrNull("database.createTables")?.getString()?.toBoolean() == true) {
            createTables()
        }
    }

    private fun createTables() {
        transaction {
            SchemaUtils.create(Roles, Permissions, RolePermissions, Users)
            SchemaUtils.create(RegistrationOrigins, DeregistrationCauses, ReportTypes)
            SchemaUtils.create(Species, Specimens, Registrations, Deregistrations)
            SchemaUtils.create(
                Reports,
                ClinicalReports,
                BehavioralReports,
                FeedingReports,
                DeathReports,
                TransferReports
            )
        }
    }

    suspend fun <T> dbQuery(block: () -> T): T =
        withContext(Dispatchers.IO) {
            transaction { block() }
        }
}