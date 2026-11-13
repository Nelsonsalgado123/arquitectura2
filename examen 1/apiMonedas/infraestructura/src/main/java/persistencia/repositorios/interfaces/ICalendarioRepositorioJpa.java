package monedas.api.infraestructura.persistencia.repositorios.interfaces;

import monedas.api.infraestructura.persistencia.entidades.CalendarioEntidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ICalendarioRepositorioJpa extends JpaRepository<CalendarioEntidad, Integer> {

    @Query("SELECT c FROM CalendarioEntidad c WHERE EXTRACT(YEAR FROM c.fecha) = ?1 ORDER BY c.fecha ASC")
    List<CalendarioEntidad> findByYear(int year);

    @Modifying
    @Transactional
    @Query("DELETE FROM CalendarioEntidad c WHERE EXTRACT(YEAR FROM c.fecha) = ?1")
    void deleteByYear(int year);
}
