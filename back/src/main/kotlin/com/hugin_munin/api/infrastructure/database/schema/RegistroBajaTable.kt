package com.hugin_munin.api.infrastructure.database.schemas

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.date
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.kotlin.datetime.date

object RegistroBajaTable : Table("registro_baja") {
    val id = integer("id_registro_baja").autoIncrement()
    val especimenId = integer("id_especimen").uniqueIndex().references(EspecimenTable.id, onDelete = ReferenceOption.CASCADE)
    val causaBajaId = integer("id_causa_baja").references(CausaBajaTable.id, onDelete = ReferenceOption.RESTRICT)
    val responsableId = integer("id_responsable").references(UsuarioTable.id, onDelete = ReferenceOption.RESTRICT)
    val fechaBaja = date("fecha_baja")
    val observacion = text("observacion").nullable()
    override val primaryKey = PrimaryKey(id)
}
