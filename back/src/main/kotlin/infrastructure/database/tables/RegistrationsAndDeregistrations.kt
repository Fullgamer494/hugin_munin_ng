package com.hugin_munin.infrastructure.database.tables

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.date

object Registrations : IntIdTable("registro_alta", "id_registro_alta") {
    val specimenId = reference("id_especimen", Specimens, onDelete = ReferenceOption.RESTRICT)
    val originId = reference("id_origen_alta", RegistrationOrigins, onDelete = ReferenceOption.RESTRICT)
    val registeredBy = reference("id_responsable", Users, onDelete = ReferenceOption.RESTRICT)
    val registrationDate = date("fecha_ingreso")
    val origin = varchar("procedencia", 200).nullable()
    val observations = text("observacion").nullable()
    val createdAt = timestamp("fecha_registro").defaultExpression(CurrentTimestamp)
}

object Deregistrations : IntIdTable("registro_baja", "id_registro_baja") {
    val specimenId = reference("id_especimen", Specimens, onDelete = ReferenceOption.RESTRICT)
    val causeId = reference("id_causa_baja", DeregistrationCauses, onDelete = ReferenceOption.RESTRICT)
    val registeredBy = reference("id_responsable", Users, onDelete = ReferenceOption.RESTRICT)
    val deregistrationDate = date("fecha_baja")
    //val destination = varchar("destino", 200).nullable()
    val observations = text("observacion").nullable()
    val createdAt = timestamp("fecha_registro").defaultExpression(CurrentTimestamp)
}