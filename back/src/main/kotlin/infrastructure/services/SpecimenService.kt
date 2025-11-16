package com.hugin_munin.infrastructure.services

import com.hugin_munin.infrastructure.database.DatabaseFactory.dbQuery
import com.hugin_munin.infrastructure.database.tables.Species
import com.hugin_munin.infrastructure.database.tables.Specimens
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.time.LocalDate

@Serializable
data class SpeciesRequest(
    val genus: String,
    val species: String,
    val commonName: String? = null
)

@Serializable
data class SpeciesResponse(
    val id: Int,
    val genus: String,
    val species: String,
    val commonName: String?
)

@Serializable
data class SpecimenRequest(
    val inventoryNumber: String,
    val speciesId: Int,
    val specimenName: String,
    val sex: String?,
    val birthDate: String?
)

@Serializable
data class SpecimenResponse(
    val id: Int,
    val inventoryNumber: String,
    val speciesId: Int,
    val genus: String,
    val species: String,
    val commonName: String?,
    val specimenName: String,
    val sex: String?,
    val birthDate: String?,
    val active: Boolean,
    val registrationDate: String
)

@Serializable
data class PaginatedSpecimenResponse(
    val data: List<SpecimenResponse>,
    val total: Long,
    val page: Int,
    val pageSize: Int
)

class SpecimenService {

    suspend fun createSpecies(data: SpeciesRequest): Int = dbQuery {
        Species.insert { stmt ->
            stmt[genus] = data.genus
            stmt[species] = data.species
            stmt[commonName] = data.commonName
        }[Species.id].value
    }

    suspend fun getAllSpecies(): List<SpeciesResponse> = dbQuery {
        Species.selectAll().map { toSpeciesResponse(it) }
    }

    suspend fun getSpeciesById(id: Int): SpeciesResponse? = dbQuery {
        Species.selectAll()
            .where { Species.id eq id }
            .map { toSpeciesResponse(it) }
            .singleOrNull()
    }

    suspend fun createSpecimen(data: SpecimenRequest): Int = dbQuery {
        val duplicateCount = Specimens.selectAll()
            .where { Specimens.inventoryNumber eq data.inventoryNumber }
            .count()

        if (duplicateCount > 0) {
            throw IllegalArgumentException("Ya existe un espécimen con el número de inventario: ${data.inventoryNumber}")
        }

        Specimens.insert { stmt ->
            stmt[inventoryNumber] = data.inventoryNumber
            stmt[speciesId] = data.speciesId
            stmt[specimenName] = data.specimenName
            stmt[sex] = data.sex?.firstOrNull()
            stmt[birthDate] = data.birthDate?.let { LocalDate.parse(it) }
            stmt[active] = true
        }[Specimens.id].value
    }

    suspend fun getSpecimensPaginated(
        page: Int,
        pageSize: Int,
        search: String? = null,
        speciesIdFilter: Int? = null,
        genderFilter: String? = null,
        activeFilter: Boolean? = null
    ): PaginatedSpecimenResponse = dbQuery {

        val query = (Specimens innerJoin Species).selectAll()

        search?.let {
            query.andWhere {
                (Specimens.inventoryNumber like "%$it%") or (Specimens.specimenName like "%$it%")
            }
        }

        speciesIdFilter?.let {
            query.andWhere { Specimens.speciesId eq it }
        }

        genderFilter?.let {
            if (it.isNotEmpty()) {
                query.andWhere { Specimens.sex eq it[0] }
            }
        }

        activeFilter?.let {
            query.andWhere { Specimens.active eq it }
        }

        val totalRecords = query.count()

        val offset = ((page - 1) * pageSize).toLong()

        val results = query
            .limit(pageSize).offset(offset)
            .orderBy(Specimens.registrationDate to SortOrder.DESC) // Más recientes primero
            .map { toSpecimenResponse(it) }

        PaginatedSpecimenResponse(
            data = results,
            total = totalRecords,
            page = page,
            pageSize = pageSize
        )
    }

    suspend fun getAllSpecimens(): List<SpecimenResponse> = dbQuery {
        (Specimens innerJoin Species)
            .selectAll()
            .where { Specimens.active eq true }
            .map { toSpecimenResponse(it) }
    }

    suspend fun getSpecimenById(id: Int): SpecimenResponse? = dbQuery {
        (Specimens innerJoin Species)
            .selectAll()
            .where { Specimens.id eq id }
            .map { toSpecimenResponse(it) }
            .singleOrNull()
    }

    suspend fun updateSpecimen(id: Int, data: SpecimenRequest): Boolean = dbQuery {
        val duplicate = Specimens.selectAll()
            .where { (Specimens.inventoryNumber eq data.inventoryNumber) and (Specimens.id neq id) }
            .count()

        if (duplicate > 0) throw IllegalArgumentException("El número de inventario ya pertenece a otro espécimen")

        Specimens.update({ Specimens.id eq id }) { stmt ->
            stmt[inventoryNumber] = data.inventoryNumber
            stmt[speciesId] = data.speciesId
            stmt[specimenName] = data.specimenName
            stmt[sex] = data.sex?.firstOrNull()
            stmt[birthDate] = data.birthDate?.let { dateStr -> LocalDate.parse(dateStr) }
        } > 0
    }

    suspend fun deleteSpecimen(id: Int): Boolean = dbQuery {
        Specimens.update({ Specimens.id eq id }) { stmt ->
            stmt[active] = false
        } > 0
    }

    suspend fun searchByName(name: String): List<SpecimenResponse> = dbQuery {
        (Specimens innerJoin Species)
            .selectAll()
            .where {
                (Specimens.specimenName like "%$name%") and (Specimens.active eq true)
            }
            .map { toSpecimenResponse(it) }
    }

    private fun toSpeciesResponse(row: ResultRow) = SpeciesResponse(
        id = row[Species.id].value,
        genus = row[Species.genus],
        species = row[Species.species],
        commonName = row[Species.commonName]
    )

    private fun toSpecimenResponse(row: ResultRow) = SpecimenResponse(
        id = row[Specimens.id].value,
        inventoryNumber = row[Specimens.inventoryNumber],
        speciesId = row[Specimens.speciesId].value,
        genus = row[Species.genus],
        species = row[Species.species],
        commonName = row[Species.commonName],
        specimenName = row[Specimens.specimenName],
        sex = row[Specimens.sex]?.toString(),
        birthDate = row[Specimens.birthDate]?.toString(),
        active = row[Specimens.active],
        registrationDate = row[Specimens.registrationDate].toString()
    )
}