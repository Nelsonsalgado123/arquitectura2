package monedas.api.infraestructura.persistencia.repositorios;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import monedas.api.core.repositorios.ITipoRepositorio;
import monedas.api.dominio.entidades.Tipo;
import monedas.api.infraestructura.persistencia.entidades.TipoEntidad;
import monedas.api.infraestructura.persistencia.mapeadores.TipoMapeador;
import monedas.api.infraestructura.persistencia.repositorios.interfaces.ITipoRepositorioJpa;

@Component
public class TipoRepositorio implements ITipoRepositorio {

    @Autowired
    private ITipoRepositorioJpa repositorio;

    @Override
    public List<Tipo> listar() {
        return repositorio.findAll()
                .stream()
                .map(TipoMapeador::toModelo)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Tipo> obtenerPorId(int id) {
        return repositorio.findById(id)
                .map(TipoMapeador::toModelo);
    }

    @Override
    public List<Tipo> buscarPorNombre(String nombre) {
        return repositorio.buscar(nombre)
                .stream()
                .map(TipoMapeador::toModelo)
                .collect(Collectors.toList());
    }

    @Override
    public Tipo guardar(Tipo tipo) {
        TipoEntidad entidad = TipoMapeador.toEntidad(tipo);
        TipoEntidad guardado = repositorio.save(entidad);
        return TipoMapeador.toModelo(guardado);
    }

    @Override
    public boolean eliminar(int id) {
        try {
            if (repositorio.existsById(id)) {
                repositorio.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception ex) {
            return false;
        }
    }
}
