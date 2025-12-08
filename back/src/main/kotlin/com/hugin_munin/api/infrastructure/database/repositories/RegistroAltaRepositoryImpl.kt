package com.hugin_munin.api.infrastructure.database.repositories

import com.hugin_munin.api.domain.models.RegistroAlta
import com.hugin_munin.api.domain.ports.RegistroAltaRepository
import com.hugin_munin.api.infrastructure.database.DatabaseFactory.dbQuery
import com.hugin_munin.api.infrastructure.database.schemas.RegistroAltaTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class RegistroAltaRepositoryImpl : RegistroAltaRepository {

    private fun resultRowToRegistroAlta(row: ResultRow) = RegistroAlta(
        id = row[RegistroAltaTable.id],
        especimenId = row[RegistroAltaTable.especimenId],
        origenAltaId = row[RegistroAltaTable.origenAltaId],
        responsableId = row[RegistroAltaTable.responsableId],
        fechaIngreso = row[RegistroAltaTable.fechaIngreso],
        procedencia = row[RegistroAltaTable.procedencia],
        observacion = row[RegistroAltaTable.observacion],
        idReporteTraslado = row[RegistroAltaTable.idReporteTraslado]
    )

    override suspend fun findAll(): List<RegistroAlta> = dbQuery {
        RegistroAltaTable.selectAll()
            .map(::resultRowToRegistroAlta)
    }

    override suspend fun findById(id: Int): RegistroAlta? = dbQuery {
        RegistroAltaTable.select { RegistroAltaTable.id eq id }
            .map(::resultRowToRegistroAlta)
            .singleOrNull()
    }

    override suspend fun findByEspecimenId(especimenId: Int): RegistroAlta? = dbQuery {
        RegistroAltaTable.select { RegistroAltaTable.especimenId eq especimenId }
            .map(::resultRowToRegistroAlta)
            .singleOrNull()
    }

    override suspend fun save(alta: RegistroAlta): RegistroAlta = dbQuery {
        val insertStatement = RegistroAltaTable.insert {
            it[especimenId] = alta.especimenId
            it[origenAltaId] = alta.origenAltaId
            it[responsableId] = alta.responsableId
            it[fechaIngreso] = alta.fechaIngreso
            it[procedencia] = alta.procedencia
            it[observacion] = alta.observacion
            it[idReporteTraslado] = alta.idReporteTraslado
        }
        val id = insertStatement.resultedValues?.singleOrNull()?.get(RegistroAltaTable.id)
            ?: throw IllegalStateException("No se pudo crear el registro de alta")
        alta.copy(id = id)
    }

    override suspend fun update(id: Int, alta: RegistroAlta): RegistroAlta? = dbQuery {
        val rowsAffected = RegistroAltaTable.update({ RegistroAltaTable.id eq id }) {
            it[origenAltaId] = alta.origenAltaId
            it[procedencia] = alta.procedencia
            it[observacion] = alta.observacion
        }
        if (rowsAffected > 0) alta.copy(id = id) else null
    }

    override suspend fun delete(id: Int): Boolean = dbQuery {
        RegistroAltaTable.deleteWhere { RegistroAltaTable.id eq id } > 0
    }
}