package com.hugin_munin.api.infrastructure.database.repositories

import com.hugin_munin.api.domain.models.Especimen
import com.hugin_munin.api.domain.ports.EspecimenRepository
import com.hugin_munin.api.infrastructure.database.DatabaseFactory.dbQuery
import com.hugin_munin.api.infrastructure.database.schemas.EspecimenTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class EspecimenRepositoryImpl : EspecimenRepository {

    private fun resultRowToEspecimen(row: ResultRow) = Especimen(
        id = row[EspecimenTable.id],
        numInventario = row[EspecimenTable.numInventario],
        especieId = row[EspecimenTable.especieId],
        nombre = row[EspecimenTable.nombre],
        activo = row[EspecimenTable.activo]
    )

    override suspend fun findAll(): List<Especimen> = dbQuery {
        EspecimenTable.selectAll()
            .map(::resultRowToEspecimen)
    }

    override suspend fun findById(id: Int): Especimen? = dbQuery {
        EspecimenTable.select { EspecimenTable.id eq id }
            .map(::resultRowToEspecimen)
            .singleOrNull()
    }

    override suspend fun save(especimen: Especimen): Especimen = dbQuery {
        val insertStatement = EspecimenTable.insert {
            it[numInventario] = especimen.numInventario
            it[especieId] = especimen.especieId
            it[nombre] = especimen.nombre
            it[activo] = especimen.activo
        }
        val id = insertStatement.resultedValues?.singleOrNull()?.get(EspecimenTable.id)
        especimen.copy(id = id)
    }

    override suspend fun update(id: Int, especimen: Especimen): Especimen? = dbQuery {
        val rowsAffected = EspecimenTable.update({ EspecimenTable.id eq id }) {
            it[numInventario] = especimen.numInventario
            it[especieId] = especimen.especieId
            it[nombre] = especimen.nombre
            it[activo] = especimen.activo
        }
        if (rowsAffected > 0) especimen.copy(id = id) else null
    }

    override suspend fun delete(id: Int): Boolean = dbQuery {
        EspecimenTable.deleteWhere { EspecimenTable.id eq id } > 0
    }
}