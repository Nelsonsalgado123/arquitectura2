package monedas.api.core.servicios;

import java.util.List;
import monedas.api.dominio.entidades.Tipo;

public interface ITipoServicio {

    List<Tipo> listar();

    Tipo obtener(int id);

    List<Tipo> buscar(String nombre);

    Tipo agregar(Tipo tipo);

    Tipo modificar(Tipo tipo);

    boolean eliminar(int id);
}
