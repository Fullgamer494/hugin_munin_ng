package com.hugin_munin.infrastructure.services

import com.hugin_munin.infrastructure.database.DatabaseFactory.dbQuery
import com.hugin_munin.infrastructure.database.tables.*
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.time.LocalDate

@Serializable
data class RegistrationRequest(
    val specimenId: Int,
    val originId: Int,
    val registeredBy: Int,
    val registrationDate: String,
    val origin: String? = null,
    val observations: String? = null
)

@Serializable
data class RegistrationResponse(
    val id: Int,
    val specimenId: Int,
    val specimenName: String,
    val inventoryNumber: String,
    val genus: String,
    val species: String,
    val commonName: String?,
    val originName: String,
    val registeredByName: String,
    val registrationDate: String,
    val origin: String?,
    val observations: String?
)

@Serializable
data class DeregistrationRequest(
    val specimenId: Int,
    val causeId: Int,
    val registeredBy: Int,
    val deregistrationDate: String,
    val destination: String? = null,
    val observations: String? = null
)

@Serializable
data class DeregistrationResponse(
    val id: Int,
    val specimenId: Int,
    val specimenName: String,
    val inventoryNumber: String,
    val genus: String,
    val species: String,
    val commonName: String?,
    val causeName: String,
    val registeredByName: String,
    val deregistrationDate: String,
    val destination: String?,
    val observations: String?
)

class RegistrationService {

    suspend fun createRegistration(data: RegistrationRequest): Int = dbQuery {
        val existingRegistration = Registrations.selectAll()
            .where { Registrations.specimenId eq data.specimenId }
            .count()

        if (existingRegistration > 0) {
            throw IllegalArgumentException("Specimen already has a registration")
        }

        Registrations.insert { stmt ->
            stmt[specimenId] = data.specimenId
            stmt[originId] = data.originId
            stmt[registeredBy] = data.registeredBy
            stmt[registrationDate] = LocalDate.parse(data.registrationDate)
            stmt[origin] = data.origin
            stmt[observations] = data.observations
        }[Registrations.id].value
    }

    suspend fun getAllRegistrations(): List<RegistrationResponse> = dbQuery {
        (Registrations innerJoin Specimens innerJoin Species innerJoin RegistrationOrigins innerJoin Users)
            .selectAll()
            .map { toRegistrationResponse(it) }
    }

    suspend fun getRegistrationById(id: Int): RegistrationResponse? = dbQuery {
        (Registrations innerJoin Specimens innerJoin Species innerJoin RegistrationOrigins innerJoin Users)
            .selectAll()
            .where { Registrations.id eq id }
            .map { toRegistrationResponse(it) }
            .singleOrNull()
    }

    suspend fun updateRegistration(id: Int, data: RegistrationRequest): Boolean = dbQuery {
        Registrations.update({ Registrations.id eq id }) { stmt ->
            stmt[originId] = data.originId
            stmt[registeredBy] = data.registeredBy
            stmt[registrationDate] = LocalDate.parse(data.registrationDate)
            stmt[origin] = data.origin
            stmt[observations] = data.observations
        } > 0
    }

    suspend fun deleteRegistration(id: Int): Boolean = dbQuery {
        val registration = Registrations.selectAll()
            .where { Registrations.id eq id }
            .singleOrNull() ?: return@dbQuery false

        val specimenId = registration[Registrations.specimenId].value

        Specimens.update({ Specimens.id eq specimenId }) { stmt ->
            stmt[active] = false
        }

        Registrations.deleteWhere { Registrations.id eq id } > 0
    }

    suspend fun createDeregistration(data: DeregistrationRequest): Int = dbQuery {
        Deregistrations.insert { stmt ->
            stmt[specimenId] = data.specimenId
            stmt[causeId] = data.causeId
            stmt[registeredBy] = data.registeredBy
            stmt[deregistrationDate] = LocalDate.parse(data.deregistrationDate)
            stmt[observations] = data.observations
        }[Deregistrations.id].value
    }

    suspend fun getAllDeregistrations(): List<DeregistrationResponse> = dbQuery {
        Deregistrations
            .innerJoin(Specimens, { Deregistrations.specimenId }, { Specimens.id })
            .innerJoin(Species, { Specimens.speciesId }, { Species.id })
            .innerJoin(DeregistrationCauses, { Deregistrations.causeId }, { DeregistrationCauses.id })
            .innerJoin(Users, { Deregistrations.registeredBy }, { Users.id })
            .selectAll()
            .map { toDeregistrationResponse(it) }
    }

    private fun toRegistrationResponse(row: ResultRow) = RegistrationResponse(
        id = row[Registrations.id].value,
        specimenId = row[Specimens.id].value,
        specimenName = row[Specimens.specimenName],
        inventoryNumber = row[Specimens.inventoryNumber],
        genus = row[Species.genus],
        species = row[Species.species],
        commonName = row[Species.commonName],
        originName = row[RegistrationOrigins.originName],
        registeredByName = row[Users.username],
        registrationDate = row[Registrations.registrationDate].toString(),
        origin = row[Registrations.origin],
        observations = row[Registrations.observations]
    )

    private fun toDeregistrationResponse(row: ResultRow) = DeregistrationResponse(
        id = row[Deregistrations.id].value,
        specimenId = row[Specimens.id].value,
        specimenName = row[Specimens.specimenName],
        inventoryNumber = row[Specimens.inventoryNumber],
        genus = row[Species.genus],
        species = row[Species.species],
        commonName = row[Species.commonName],
        causeName = row[DeregistrationCauses.causeName],
        registeredByName = row[Users.username],
        deregistrationDate = row[Deregistrations.deregistrationDate].toString(),
        destination = null,
        observations = row[Deregistrations.observations]
    )
}