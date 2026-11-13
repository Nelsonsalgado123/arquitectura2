package monedas.api.infraestructura.persistencia.mapeadores;

import monedas.api.dominio.entidades.Tipo;
import monedas.api.infraestructura.persistencia.entidades.TipoEntidad;

public class TipoMapeador {

    public static Tipo toModelo(TipoEntidad entidad) {
        if (entidad == null) {
            return null;
        }
        return new Tipo(entidad.getId(), entidad.getTipo());
    }

    public static TipoEntidad toEntidad(Tipo modelo) {
        if (modelo == null) {
            return null;
        }
        return new TipoEntidad(modelo.getId(), modelo.getTipo());
    }
}
