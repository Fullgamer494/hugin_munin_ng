package com.hugin_munin.infrastructure.database.tables

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp

object RegistrationOrigins : IntIdTable("origen_alta", "id_origen_alta") {
    val originName = varchar("nombre_origen_alta", 50).uniqueIndex()
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
}

object DeregistrationCauses : IntIdTable("causa_baja", "id_causa_baja") {
    val causeName = varchar("nombre_causa_baja", 50).uniqueIndex()
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
}