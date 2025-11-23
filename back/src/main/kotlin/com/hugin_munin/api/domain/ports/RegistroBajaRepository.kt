package com.hugin_munin.api.domain.ports
import com.hugin_munin.api.domain.models.RegistroBaja
import com.hugin_munin.api.infrastructure.api.dto.RegistroBajaDetalleResponse

interface RegistroBajaRepository {
    suspend fun findAll(): List<RegistroBajaDetalleResponse>
    suspend fun findById(id: Int): RegistroBajaDetalleResponse?
    suspend fun findByEspecimenId(especimenId: Int): RegistroBajaDetalleResponse?
    suspend fun save(baja: RegistroBaja): RegistroBaja
    suspend fun update(id: Int, baja: RegistroBaja): RegistroBajaDetalleResponse?
    suspend fun delete(id: Int): Boolean
}
