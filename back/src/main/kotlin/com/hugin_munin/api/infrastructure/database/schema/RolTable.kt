package com.hugin_munin.api.infrastructure.database.schemas

import org.jetbrains.exposed.sql.Table

object RolTable : Table("rol") {
    val id = integer("id_rol").autoIncrement()
    val nombre = varchar("nombre_rol", 50).uniqueIndex()
    override val primaryKey = PrimaryKey(id)
}