package monedas.api.infraestructura.persistencia.mapeadores;

import monedas.api.dominio.entidades.Calendario;
import monedas.api.infraestructura.persistencia.entidades.CalendarioEntidad;

public class CalendarioMapeador {

    public static Calendario toModelo(CalendarioEntidad entidad) {
        if (entidad == null) {
            return null;
        }
        return new Calendario(
                entidad.getId(),
                entidad.getFecha(),
                TipoMapeador.toModelo(entidad.getTipo()),
                entidad.getDescripcion()
        );
    }

    public static CalendarioEntidad toEntidad(Calendario modelo) {
        if (modelo == null) {
            return null;
        }
        return new CalendarioEntidad(
                modelo.getId(),
                modelo.getFecha(),
                TipoMapeador.toEntidad(modelo.getTipo()),
                modelo.getDescripcion()
        );
    }
}
