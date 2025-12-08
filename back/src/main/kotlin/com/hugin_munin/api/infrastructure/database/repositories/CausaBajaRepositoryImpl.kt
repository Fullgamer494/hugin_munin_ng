package com.hugin_munin.api.infrastructure.database.repositories

import com.hugin_munin.api.domain.models.CausaBaja
import com.hugin_munin.api.domain.ports.CausaBajaRepository
import com.hugin_munin.api.infrastructure.database.DatabaseFactory.dbQuery
import com.hugin_munin.api.infrastructure.database.schemas.CausaBajaTable
import org.jetbrains.exposed.sql.*

class CausaBajaRepositoryImpl : CausaBajaRepository {

    private fun resultRowToCausaBaja(row: ResultRow) = CausaBaja(
        id = row[CausaBajaTable.id],
        nombreCausaBaja = row[CausaBajaTable.nombreCausaBaja]
    )

    override suspend fun findAll(): List<CausaBaja> = dbQuery {
        CausaBajaTable.selectAll()
            .map(::resultRowToCausaBaja)
    }

    override suspend fun findById(id: Int): CausaBaja? = dbQuery {
        CausaBajaTable.select { CausaBajaTable.id eq id }
            .map(::resultRowToCausaBaja)
            .singleOrNull()
    }
}