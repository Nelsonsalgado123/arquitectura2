package monedas.api.core.integracion;

import java.util.List;
import monedas.api.dominio.dtos.FestivoDto;

public interface IFestivoServicioExterno {

    List<FestivoDto> obtenerFestivos(int anio);
}
