package com.hugin_munin.api.domain.ports
import com.hugin_munin.api.domain.models.CausaBaja

interface CausaBajaRepository {
    suspend fun findAll(): List<CausaBaja>
    suspend fun findById(id: Int): CausaBaja?
}

