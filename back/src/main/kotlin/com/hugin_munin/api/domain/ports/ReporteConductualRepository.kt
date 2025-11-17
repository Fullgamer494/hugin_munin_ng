package com.hugin_munin.api.domain.ports

import com.hugin_munin.api.domain.models.ReporteConductual

interface ReporteConductualRepository {
    suspend fun create(reporte: ReporteConductual): Int
    suspend fun findById(id: Int): ReporteConductual?
    suspend fun findAll(): List<ReporteConductual>
    suspend fun findByEspecimen(idEspecimen: Int): List<ReporteConductual>
    suspend fun update(id: Int, reporte: ReporteConductual): Boolean
    suspend fun delete(id: Int): Boolean
}