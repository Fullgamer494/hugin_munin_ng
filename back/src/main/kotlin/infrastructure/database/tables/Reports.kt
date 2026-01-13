package com.hugin_munin.infrastructure.database.tables

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.javatime.time
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.date


object ReportTypes : IntIdTable("tipo_reporte", "id_tipo_reporte") {
    val reportTypeName = varchar("nombre_tipo_reporte", 50).uniqueIndex()
    val description = varchar("descripcion", 255).nullable()
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
}

object Reports : IntIdTable("reporte", "id_reporte") {
    val reportTypeId = reference("id_tipo_reporte", ReportTypes, onDelete = ReferenceOption.RESTRICT)
    val specimenId = reference("id_especimen", Specimens, onDelete = ReferenceOption.RESTRICT)
    val registeredBy = reference("id_usuario_registro", Users, onDelete = ReferenceOption.RESTRICT)
    val reportDate = timestamp("fecha_reporte")
    val generalObservations = text("observaciones_generales").nullable()
    val attachedFile = varchar("archivo_adjunto", 255).nullable()
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
    val updatedAt = timestamp("fecha_actualizacion").defaultExpression(CurrentTimestamp)
}

object ClinicalReports : IntIdTable("reporte_clinico", "id_reporte_clinico") {
    val reportId = reference("id_reporte", Reports, onDelete = ReferenceOption.CASCADE)
    val consultationReason = text("motivo_consulta")
    val symptoms = text("sintomas").nullable()
    val diagnosis = text("diagnostico").nullable()
    val treatment = text("tratamiento").nullable()
    val administeredMedications = text("medicamentos_administrados").nullable()
    val dosage = varchar("dosificacion", 255).nullable()
    val weight = decimal("peso", 8, 2).nullable()
    val temperature = decimal("temperatura", 5, 2).nullable()
    val heartRate = integer("frecuencia_cardiaca").nullable()
    val respiratoryRate = integer("frecuencia_respiratoria").nullable()
    val nextCheckup = date("proxima_revision").nullable()
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
}

object BehavioralReports : IntIdTable("reporte_conductual", "id_reporte_conductual") {
    val reportId = reference("id_reporte", Reports, onDelete = ReferenceOption.CASCADE)
    val observedBehavior = text("comportamiento_observado")
    val activityLevel = varchar("nivel_actividad", 50).nullable()
    val groupInteraction = text("interaccion_grupo").nullable()
    val feeding = text("alimentacion").nullable()
    val stress = bool("estres").default(false)
    val aggression = bool("agresividad").default(false)
    val abnormalBehavior = text("comportamiento_anormal").nullable()
    val environmentalEnrichment = text("enriquecimiento_ambiental").nullable()
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
}

object FeedingReports : IntIdTable("reporte_alimenticio", "id_reporte_alimenticio") {
    val reportId = reference("id_reporte", Reports, onDelete = ReferenceOption.CASCADE)
    val foodType = varchar("tipo_alimento", 100)
    val suppliedQuantity = decimal("cantidad_suministrada", 8, 2)
    val unitOfMeasure = varchar("unidad_medida", 20)
    val consumedQuantity = decimal("cantidad_consumida", 8, 2).nullable()
    val feedingTime = time("hora_alimentacion")
    val appetite = varchar("apetito", 50).nullable()
    val foodRejection = bool("rechazo_alimento").default(false)
    val supplements = text("suplementos").nullable()
    val observations = text("observaciones").nullable()
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
}

object DeathReports : IntIdTable("reporte_defuncion", "id_reporte_defuncion") {
    val reportId = reference("id_reporte", Reports, onDelete = ReferenceOption.CASCADE)
    val deathDate = timestamp("fecha_defuncion")
    val causeOfDeath = text("causa_muerte")
    val circumstances = text("circunstancias").nullable()
    val necropsyFindings = text("hallazgos_necropsia").nullable()
    val collectedSamples = text("muestras_recolectadas").nullable()
    val bodyDisposition = varchar("disposicion_cuerpo", 100).nullable()
    val complementaryStudies = text("estudios_complementarios").nullable()
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
}

object TransferReports : IntIdTable("reporte_traslado", "id_reporte_traslado") {
    val reportId = reference("id_reporte", Reports, onDelete = ReferenceOption.CASCADE)
    val originLocation = varchar("origen_ubicacion", 100)
    val destinationLocation = varchar("destino_ubicacion", 100)
    val transferReason = text("motivo_traslado")
    val transferDate = timestamp("fecha_traslado")
    val transportCondition = text("condicion_transporte").nullable()
    val transferResponsible = varchar("responsable_traslado", 100).nullable()
    val incidents = text("incidentes").nullable()
    val specimenCondition = text("estado_especimen").nullable()
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
}