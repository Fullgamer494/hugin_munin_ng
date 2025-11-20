package com.hugin_munin.api.infrastructure.database.schemas

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.timestamp

object RefreshTokenTable : Table("refresh_token") {
    val id = integer("id_refresh_token").autoIncrement()
    val userId = integer("id_usuario").references(UsuarioTable.id)
    val token = varchar("token", 500).uniqueIndex()
    val expiresAt = timestamp("fecha_expiracion")
    val createdAt = timestamp("fecha_creacion")
    val revoked = bool("revocado").default(false)
    val ipAddress = varchar("ip_address", 45).nullable()
    val userAgent = text("user_agent").nullable()

    override val primaryKey = PrimaryKey(id)
}