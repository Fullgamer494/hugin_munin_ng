package com.hugin_munin.infrastructure.database.tables

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.date


object Species : IntIdTable("especie", "id_especie") {
    val scientificName = varchar("nombre_cientifico", 150).uniqueIndex()
    val commonName = varchar("nombre_comun", 100)
    val taxonomicClass = varchar("clase", 50)
    val taxonomicOrder = varchar("orden", 50).nullable()
    val family = varchar("familia", 50).nullable()
    val genus = varchar("genero", 50).nullable()
    val conservationStatus = varchar("estado_conservacion", 50).nullable()
    val description = text("descripcion").nullable()
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
}

object Specimens : IntIdTable("especimen", "id_especimen") {
    val speciesId = reference("id_especie", Species, onDelete = org.jetbrains.exposed.sql.ReferenceOption.RESTRICT)
    val specimenName = varchar("nombre_especimen", 100).nullable()
    val sex = char("sexo", 1).nullable()
    val birthDate = date("fecha_nacimiento").nullable()
    val approximateBirthDate = bool("fecha_nacimiento_aproximada").default(false)
    val currentWeight = decimal("peso_actual", 8, 2).nullable()
    val currentLength = decimal("longitud_actual", 8, 2).nullable()
    val distinctiveFeatures = text("senas_particulares").nullable()
    val active = bool("activo").default(true)
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
    val updatedAt = timestamp("fecha_actualizacion").defaultExpression(CurrentTimestamp)
}