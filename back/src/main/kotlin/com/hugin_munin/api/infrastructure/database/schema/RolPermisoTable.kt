import com.hugin_munin.api.infrastructure.database.schemas.PermisoTable
import com.hugin_munin.api.infrastructure.database.schemas.RolTable
import org.jetbrains.exposed.sql.Table

object RolPermisoTable : Table("rol_permiso") {
    val rolId = integer("id_rol").references(RolTable.id)
    val permisoId = integer("id_permiso").references(PermisoTable.id)

    override val primaryKey = PrimaryKey(rolId, permisoId)
}