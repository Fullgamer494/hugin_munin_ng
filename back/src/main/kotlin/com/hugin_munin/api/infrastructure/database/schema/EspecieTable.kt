package com.hugin_munin.api.infrastructure.database.schemas

import org.jetbrains.exposed.sql.Table

object EspecieTable : Table("especie") {
    val id = integer("id_especie").autoIncrement()
    val genero = varchar("genero", 50)
    val especie = varchar("especie", 50)

    override val primaryKey = PrimaryKey(id)
    init {
        uniqueIndex(genero, especie)
    }
}