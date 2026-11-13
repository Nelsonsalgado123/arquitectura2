package monedas.api.core.repositorios;

import java.util.List;
import java.util.Optional;
import monedas.api.dominio.entidades.Calendario;

public interface ICalendarioRepositorio {

    List<Calendario> listarPorAnio(int anio);

    Optional<Calendario> obtenerPorId(int id);

    Calendario guardar(Calendario calendario);

    List<Calendario> guardarTodos(List<Calendario> calendarios);

    void eliminarPorAnio(int anio);
}
