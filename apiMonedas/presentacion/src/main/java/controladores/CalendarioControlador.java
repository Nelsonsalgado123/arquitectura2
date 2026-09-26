package monedas.api.controladores;

import monedas.api.infraestructura.persistencia.entidades.CalendarioEntidad;
import monedas.api.infraestructura.persistencia.entidades.TipoEntidad;
import monedas.api.infraestructura.persistencia.repositorios.interfaces.ICalendarioRepositorioJpa;
import monedas.api.infraestructura.persistencia.repositorios.interfaces.ITipoRepositorioJpa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/calendario")
@CrossOrigin(origins = "*")
public class CalendarioControlador {

    @Autowired
    private ICalendarioRepositorioJpa calendarioRepo;

    @Autowired
    private ITipoRepositorioJpa tipoRepo;

    private final String API_FESTIVOS_URL = "http://localhost:3030/api/festivos/obtener/";

    // DTO Interno para deserializar la respuesta de Node.js
    static class FestivoDTO {
        public String festivo;
        public String fecha;
    }

    @GetMapping("/generar/{year}")
    public boolean generarCalendario(@PathVariable int year) {
        try {
            // 1. Inicializar los Tipos en la BD si no existen
            TipoEntidad tipoLaboral = tipoRepo.findById(1).orElseGet(() -> tipoRepo.save(new TipoEntidad(1, "Dia laboral")));
            TipoEntidad tipoFinSemana = tipoRepo.findById(2).orElseGet(() -> tipoRepo.save(new TipoEntidad(2, "Fin de semana")));
            TipoEntidad tipoFestivo = tipoRepo.findById(3).orElseGet(() -> tipoRepo.save(new TipoEntidad(3, "Dia festivo")));

            // 2. Consumir la API de Node.js para obtener los festivos del año
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<List<FestivoDTO>> response = restTemplate.exchange(
                    API_FESTIVOS_URL + year,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<FestivoDTO>>() {}
            );
            
            List<FestivoDTO> festivos = response.getBody();
            if (festivos == null) festivos = new ArrayList<>();
            
            // Convertir la lista a un mapa para búsqueda rápida (Clave: YYYY-MM-DD)
            Map<String, String> mapaFestivos = new HashMap<>();
            for (FestivoDTO f : festivos) {
                mapaFestivos.put(f.fecha, f.festivo);
            }

            // 3. Iterar los días del año
            Calendar cal = Calendar.getInstance();
            cal.set(year, Calendar.JANUARY, 1);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            List<CalendarioEntidad> diasAGuardar = new ArrayList<>();

            while (cal.get(Calendar.YEAR) == year) {
                Date fechaActual = cal.getTime();
                String fechaString = sdf.format(fechaActual);
                int diaSemana = cal.get(Calendar.DAY_OF_WEEK); // 1: Sunday, 2: Monday... 7: Saturday

                TipoEntidad tipoDia;
                String descripcion = "";

                if (mapaFestivos.containsKey(fechaString)) {
                    // Es Festivo
                    tipoDia = tipoFestivo;
                    descripcion = mapaFestivos.get(fechaString);
                } else if (diaSemana == Calendar.SATURDAY || diaSemana == Calendar.SUNDAY) {
                    // Fin de semana no festivo
                    tipoDia = tipoFinSemana;
                    descripcion = (diaSemana == Calendar.SATURDAY) ? "Sábado" : "Domingo";
                } else {
                    // Día laboral
                    tipoDia = tipoLaboral;
                    String[] nombresDias = {"", "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"};
                    descripcion = nombresDias[diaSemana];
                }

                diasAGuardar.add(new CalendarioEntidad(fechaActual, tipoDia, descripcion));
                cal.add(Calendar.DAY_OF_MONTH, 1); // Avanzar un día
            }

            // 4. Guardar todos los días en PostgreSQL
            calendarioRepo.saveAll(diasAGuardar);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @GetMapping("/listar/{year}")
    public List<CalendarioEntidad> listarCalendario(@PathVariable int year) {
        return calendarioRepo.findByYear(year);
    }
}
