package com.hugin_munin.api.domain.ports
import com.hugin_munin.api.domain.models.Especimen

interface EspecimenRepository {
    suspend fun findAll(): List<Especimen>
    suspend fun findById(id: Int): Especimen?
    suspend fun save(especimen: Especimen): Especimen
    suspend fun update(id: Int, especimen: Especimen): Especimen?
    suspend fun delete(id: Int): Boolean
}