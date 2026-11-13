package monedas.api.aplicacion.presentacion;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import monedas.api.core.servicios.ITipoServicio;
import monedas.api.dominio.entidades.Tipo;

@RestController
@RequestMapping("/api/tipos")
@CrossOrigin(origins = "*")
public class TipoControlador {

    @Autowired
    private ITipoServicio servicio;

    @GetMapping("/")
    public List<Tipo> listar() {
        return servicio.listar();
    }

    @GetMapping("/obtener/{id}")
    public Tipo obtener(@PathVariable int id) {
        return servicio.obtener(id);
    }

    @GetMapping("/buscar/{nombre}")
    public List<Tipo> buscar(@PathVariable String nombre) {
        return servicio.buscar(nombre);
    }

    @PostMapping("/")
    public Tipo crear(@RequestBody Tipo tipo) {
        return servicio.agregar(tipo);
    }

    @PutMapping("/")
    public Tipo actualizar(@RequestBody Tipo tipo) {
        return servicio.modificar(tipo);
    }

    @DeleteMapping("/{id}")
    public boolean eliminar(@PathVariable int id) {
        return servicio.eliminar(id);
    }
}
