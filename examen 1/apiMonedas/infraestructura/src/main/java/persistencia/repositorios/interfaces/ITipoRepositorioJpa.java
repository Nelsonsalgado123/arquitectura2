package monedas.api.infraestructura.persistencia.repositorios.interfaces;

import monedas.api.infraestructura.persistencia.entidades.TipoEntidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITipoRepositorioJpa extends JpaRepository<TipoEntidad, Integer> {
    TipoEntidad findByTipo(String tipo);
}
