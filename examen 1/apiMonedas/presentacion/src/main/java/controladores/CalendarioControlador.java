package monedas.api.controladores;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import monedas.api.core.servicios.ICalendarioServicio;
import monedas.api.dominio.entidades.Calendario;

@RestController
@RequestMapping("/api/calendario")
@CrossOrigin(origins = "*")
public class CalendarioControlador {

    @Autowired
    private ICalendarioServicio servicio;

    @GetMapping("/generar/{year}")
    public boolean generarCalendario(@PathVariable int year) {
        return servicio.generar(year);
    }

    @GetMapping("/listar/{year}")
    public List<Calendario> listarCalendario(@PathVariable int year) {
        return servicio.listar(year);
    }
}
