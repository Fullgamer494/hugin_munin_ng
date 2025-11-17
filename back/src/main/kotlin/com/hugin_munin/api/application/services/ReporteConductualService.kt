package com.hugin_munin.api.application.services

import com.hugin_munin.api.domain.models.ReporteConductual
import com.hugin_munin.api.domain.ports.ReporteConductualRepository

class ReporteConductualService(
    private val repository: ReporteConductualRepository
) {
    suspend fun createReporte(reporte: ReporteConductual, rolUsuario: Int): Int {
        require(rolUsuario == 2) { "Solo usuarios con rol Biólogo pueden crear reportes conductuales" }
        require(reporte.asunto.isNotBlank()) { "El asunto no puede estar vacío" }
        require(reporte.contenido.isNotBlank()) { "El contenido no puede estar vacío" }

        return repository.create(reporte)
    }

    suspend fun getReporte(id: Int): ReporteConductual? =
        repository.findById(id)

    suspend fun getAllReportes(): List<ReporteConductual> =
        repository.findAll()

    suspend fun getReportesByEspecimen(idEspecimen: Int): List<ReporteConductual> =
        repository.findByEspecimen(idEspecimen)

    suspend fun updateReporte(id: Int, reporte: ReporteConductual, rolUsuario: Int): Boolean {
        require(rolUsuario == 2) { "Solo usuarios con rol Biólogo pueden modificar reportes conductuales" }
        require(reporte.asunto.isNotBlank()) { "El asunto no puede estar vacío" }
        require(reporte.contenido.isNotBlank()) { "El contenido no puede estar vacío" }

        return repository.update(id, reporte)
    }

    suspend fun deleteReporte(id: Int, rolUsuario: Int): Boolean {
        require(rolUsuario == 2) { "Solo usuarios con rol Biólogo pueden eliminar reportes conductuales" }
        return repository.delete(id)
    }
}