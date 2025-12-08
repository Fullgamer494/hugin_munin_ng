package com.hugin_munin.api.domain.models

enum class Area(val valor: String) {
    EXTERNO("Externo"),
    EXHIBICION("Exhibición"),
    GUARDERIA("Guardería"),
    CUARENTENA("Cuarentena");

    companion object {
        fun fromString(valor: String): Area? {
            return entries.find { it.valor.equals(valor, ignoreCase = true) }
        }

        fun valoresPermitidos(): List<String> {
            return entries.map { it.valor }
        }
    }
}