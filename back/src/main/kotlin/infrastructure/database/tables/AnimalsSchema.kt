package com.hugin_munin.infrastructure.database.tables

import kotlinx.coroutines.Dispatchers
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.like
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDate


@Serializable
data class EspecieData(
    val id: Int? = null,
    val genero: String,
    val especie: String,
    val nombreComun: String?
)

@Serializable
data class EspecimenData(
    val numInventario: String,
    val id_especie: Int,
    val nombreEspecimen: String,
    val sexo: String,
    val fechaNacimiento: String?,
    val activo: Boolean = true
)

@Serializable
data class FullAnimalRecord(
    val id: Int,
    val numInventario: String,
    val nombreEspecimen: String,
    val sexo: String,
    val fechaNacimiento: String?,
    val activo: Boolean,
    val genero: String,
    val especie: String,
    val nombreComun: String?
)




class AnimalService(private val database: Database) {

    // Table 'especie'
    object Especies : Table("especie") {
        val id = integer("id_especie").autoIncrement()
        val genero = varchar("genero", length = 50)
        val especie = varchar("especie", length = 50)
        val nombreComun = varchar("nombre_comun", length = 100).nullable()

        override val primaryKey = PrimaryKey(id)
        init {
            uniqueIndex(genero, especie)
        }
    }

    // Table 'especimen'
    object Especimenes : Table("especimen") {
        val id = integer("id_especimen").autoIncrement()
        val numInventario = varchar("num_inventario", length = 20).uniqueIndex()
        val id_especie = integer("id_especie")
            .references(Especies.id, onDelete = ReferenceOption.RESTRICT)
        val nombreEspecimen = varchar("nombre_especimen", length = 100)
        val sexo = char("sexo").check { it inList listOf('M', 'F', 'I') }
        val fechaNacimiento = date("fecha_nacimiento").nullable()
        val activo = bool("activo").default(true)
        val fechaRegistro = datetime("fecha_registro").defaultExpression(CurrentDateTime)

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Especies, Especimenes)
        }
    }

    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }

    private fun mapRowToFullAnimal(row: ResultRow) = FullAnimalRecord(
        id = row[Especimenes.id],
        numInventario = row[Especimenes.numInventario],
        nombreEspecimen = row[Especimenes.nombreEspecimen],
        sexo = row[Especimenes.sexo].toString(),
        fechaNacimiento = row[Especimenes.fechaNacimiento]?.toString(),
        activo = row[Especimenes.activo],
        genero = row[Especies.genero],
        especie = row[Especies.especie],
        nombreComun = row[Especies.nombreComun]
    )

    // create especie
    suspend fun createEspecie(data: EspecieData): Int = dbQuery {
        Especies.insert {
            it[genero] = data.genero
            it[especie] = data.especie
            it[nombreComun] = data.nombreComun
        }[Especies.id]
    }

    // create especimen
    suspend fun createEspecimen(especimen: EspecimenData): Int = dbQuery {
        val dateOfBirth = especimen.fechaNacimiento?.let { LocalDate.parse(it) }

        Especimenes.insert {
            it[numInventario] = especimen.numInventario
            it[id_especie] = especimen.id_especie
            it[nombreEspecimen] = especimen.nombreEspecimen
            it[sexo] = especimen.sexo.first()
            it[fechaNacimiento] = dateOfBirth
            it[activo] = especimen.activo
        }[Especimenes.id]
    }

    // read
    suspend fun readAll(): List<FullAnimalRecord> {
        return dbQuery {
            (Especimenes innerJoin Especies).selectAll().map(::mapRowToFullAnimal)
        }
    }

    // read id
    suspend fun read(id: Int): FullAnimalRecord? {
        return dbQuery {
            (Especimenes innerJoin Especies)
                .select(Especimenes.id eq id)
                .map(::mapRowToFullAnimal)
                .singleOrNull()
        }
    }

    // UPDATE ESPECIMEN
    suspend fun updateEspecimen(id: Int, especimen: EspecimenData) {
        dbQuery {
            val dateOfBirth = especimen.fechaNacimiento?.let { LocalDate.parse(it) }

            Especimenes.update({ Especimenes.id eq id }) {
                it[numInventario] = especimen.numInventario
                it[id_especie] = especimen.id_especie
                it[nombreEspecimen] = especimen.nombreEspecimen
                it[sexo] = especimen.sexo.first()
                it[fechaNacimiento] = dateOfBirth
                it[activo] = especimen.activo
            }
        }
    }

    // DELETE ESPECIMEN
    suspend fun delete(id: Int) {
        dbQuery {
            Especimenes.deleteWhere { Especimenes.id eq id }
        }
    }


    suspend fun searchByName(searchName: String): List<FullAnimalRecord> {
        return dbQuery {
            (Especimenes innerJoin Especies)
                .select(Especimenes.nombreEspecimen like "%$searchName%")
                .map(::mapRowToFullAnimal)
        }
    }


    suspend fun filterBySpecies(species: String): List<FullAnimalRecord> {
        return dbQuery {
            (Especimenes innerJoin Especies)
                .select(Especies.genero like "%$species%" or (Especies.especie like "%$species%"))
                .map(::mapRowToFullAnimal)
        }
    }


    suspend fun filterByCommonName(commonName: String): List<FullAnimalRecord> {
        return dbQuery {
            (Especimenes innerJoin Especies)
                .select(Especies.nombreComun like "%$commonName%")
                .map(::mapRowToFullAnimal)
        }
    }
}