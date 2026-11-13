package monedas.api.infraestructura.persistencia.repositorios.interfaces;

import java.util.List;
import monedas.api.infraestructura.persistencia.entidades.TipoEntidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ITipoRepositorioJpa extends JpaRepository<TipoEntidad, Integer> {

    TipoEntidad findByTipo(String tipo);

    @Query("SELECT t FROM TipoEntidad t WHERE LOWER(t.tipo) LIKE LOWER(CONCAT('%', ?1, '%')) ORDER BY t.id ASC")
    List<TipoEntidad> buscar(String nombre);
}
