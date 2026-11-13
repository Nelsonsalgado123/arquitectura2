package monedas.api.infraestructura.persistencia.repositorios;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import monedas.api.core.repositorios.ICalendarioRepositorio;
import monedas.api.dominio.entidades.Calendario;
import monedas.api.infraestructura.persistencia.entidades.CalendarioEntidad;
import monedas.api.infraestructura.persistencia.mapeadores.CalendarioMapeador;
import monedas.api.infraestructura.persistencia.repositorios.interfaces.ICalendarioRepositorioJpa;

@Component
public class CalendarioRepositorio implements ICalendarioRepositorio {

    @Autowired
    private ICalendarioRepositorioJpa repositorio;

    @Override
    public List<Calendario> listarPorAnio(int anio) {
        return repositorio.findByYear(anio)
                .stream()
                .map(CalendarioMapeador::toModelo)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Calendario> obtenerPorId(int id) {
        return repositorio.findById(id)
                .map(CalendarioMapeador::toModelo);
    }

    @Override
    public Calendario guardar(Calendario calendario) {
        CalendarioEntidad entidad = CalendarioMapeador.toEntidad(calendario);
        CalendarioEntidad guardado = repositorio.save(entidad);
        return CalendarioMapeador.toModelo(guardado);
    }

    @Override
    public List<Calendario> guardarTodos(List<Calendario> calendarios) {
        List<CalendarioEntidad> entidades = calendarios.stream()
                .map(CalendarioMapeador::toEntidad)
                .collect(Collectors.toList());
        return repositorio.saveAll(entidades)
                .stream()
                .map(CalendarioMapeador::toModelo)
                .collect(Collectors.toList());
    }

    @Override
    public void eliminarPorAnio(int anio) {
        repositorio.deleteByYear(anio);
    }
}
