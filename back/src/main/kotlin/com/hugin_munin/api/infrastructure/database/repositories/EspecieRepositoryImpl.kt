package com.hugin_munin.api.infrastructure.database.repositories

import com.hugin_munin.api.domain.models.Especie
import com.hugin_munin.api.domain.ports.EspecieRepository
import com.hugin_munin.api.infrastructure.database.DatabaseFactory.dbQuery
import com.hugin_munin.api.infrastructure.database.schemas.EspecieTable
import org.jetbrains.exposed.sql.*

class EspecieRepositoryImpl : EspecieRepository {

    private fun resultRowToEspecie(row: ResultRow) = Especie(
        id = row[EspecieTable.id],
        genero = row[EspecieTable.genero],
        especie = row[EspecieTable.especie]
    )

    override suspend fun findById(id: Int): Especie? = dbQuery {
        EspecieTable.select { EspecieTable.id eq id }
            .map(::resultRowToEspecie)
            .singleOrNull()
    }

    override suspend fun findByGeneroAndEspecie(genero: String, especie: String): Especie? = dbQuery {
        EspecieTable.select {
            (EspecieTable.genero eq genero) and (EspecieTable.especie eq especie)
        }
            .map(::resultRowToEspecie)
            .singleOrNull()
    }

    override suspend fun save(especie: Especie): Especie = dbQuery {
        val insertStatement = EspecieTable.insert {
            it[genero] = especie.genero
            it[EspecieTable.especie] = especie.especie
        }
        val id = insertStatement.resultedValues?.singleOrNull()?.get(EspecieTable.id)
        especie.copy(id = id)
    }
}