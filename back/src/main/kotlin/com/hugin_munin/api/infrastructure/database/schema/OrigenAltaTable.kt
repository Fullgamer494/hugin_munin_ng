package com.hugin_munin.api.infrastructure.database.schemas

import org.jetbrains.exposed.sql.Table

object OrigenAltaTable : Table("origen_alta") {
    val id = integer("id_origen_alta").autoIncrement()
    val nombre = varchar("nombre_origen_alta", 100)
    override val primaryKey = PrimaryKey(id)
}