package com.hugin_munin.infrastructure.database.tables

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.date

object Registrations : IntIdTable("alta", "id_alta") {
    val specimenId = reference("id_especimen", Specimens, onDelete = ReferenceOption.RESTRICT)
    val originId = reference("id_origen_alta", RegistrationOrigins, onDelete = ReferenceOption.RESTRICT)
    val registeredBy = reference("id_usuario_registro", Users, onDelete = ReferenceOption.RESTRICT)
    val registrationDate = date("fecha_alta")
    val guideNumber = varchar("numero_guia", 50).nullable()
    val origin = varchar("procedencia", 200).nullable()
    val arrivalCondition = text("condicion_llegada").nullable()
    val observations = text("observaciones").nullable()
    val documentFile = varchar("archivo_documento", 255).nullable()
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
    val updatedAt = timestamp("fecha_actualizacion").defaultExpression(CurrentTimestamp)
}

object Deregistrations : IntIdTable("baja", "id_baja") {
    val specimenId = reference("id_especimen", Specimens, onDelete = ReferenceOption.RESTRICT)
    val causeId = reference("id_causa_baja", DeregistrationCauses, onDelete = ReferenceOption.RESTRICT)
    val registeredBy = reference("id_usuario_registro", Users, onDelete = ReferenceOption.RESTRICT)
    val deregistrationDate = date("fecha_baja")
    val destination = varchar("destino", 200).nullable()
    val observations = text("observaciones").nullable()
    val documentFile = varchar("archivo_documento", 255).nullable()
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
    val updatedAt = timestamp("fecha_actualizacion").defaultExpression(CurrentTimestamp)
}