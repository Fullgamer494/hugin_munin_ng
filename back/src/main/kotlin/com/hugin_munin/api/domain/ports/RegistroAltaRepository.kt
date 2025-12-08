package com.hugin_munin.api.domain.ports
import com.hugin_munin.api.domain.models.RegistroAlta

interface RegistroAltaRepository {
    suspend fun findAll(): List<RegistroAlta>
    suspend fun findById(id: Int): RegistroAlta?
    suspend fun findByEspecimenId(especimenId: Int): RegistroAlta?
    suspend fun save(alta: RegistroAlta): RegistroAlta
    suspend fun update(id: Int, alta: RegistroAlta): RegistroAlta?
    suspend fun delete(id: Int): Boolean
}