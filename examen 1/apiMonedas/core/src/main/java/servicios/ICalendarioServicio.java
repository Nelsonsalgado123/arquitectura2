package monedas.api.core.servicios;

import java.util.List;
import monedas.api.dominio.entidades.Calendario;

public interface ICalendarioServicio {

    boolean generar(int anio);

    List<Calendario> listar(int anio);
}
