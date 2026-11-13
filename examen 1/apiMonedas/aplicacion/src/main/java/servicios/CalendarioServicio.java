package monedas.api.aplicacion.servicios;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import monedas.api.core.integracion.IFestivoServicioExterno;
import monedas.api.core.repositorios.ICalendarioRepositorio;
import monedas.api.core.repositorios.ITipoRepositorio;
import monedas.api.core.servicios.ICalendarioServicio;
import monedas.api.dominio.dtos.FestivoDto;
import monedas.api.dominio.entidades.Calendario;
import monedas.api.dominio.entidades.Tipo;

@Service
public class CalendarioServicio implements ICalendarioServicio {

    @Autowired
    private ICalendarioRepositorio calendarioRepositorio;

    @Autowired
    private ITipoRepositorio tipoRepositorio;

    @Autowired
    private IFestivoServicioExterno festivoServicioExterno;

    private Tipo obtenerOCrearTipo(int idEsperado, String nombreTipo) {
        return tipoRepositorio.obtenerPorId(idEsperado)
                .orElseGet(() -> {
                    List<Tipo> existentes = tipoRepositorio.buscarPorNombre(nombreTipo);
                    if (!existentes.isEmpty()) {
                        return existentes.get(0);
                    }
                    return tipoRepositorio.guardar(new Tipo(0, nombreTipo));
                });
    }

    @Override
    public boolean generar(int anio) {
        try {
            Tipo tipoLaboral = obtenerOCrearTipo(1, "Día laboral");
            Tipo tipoFinSemana = obtenerOCrearTipo(2, "Fin de semana");
            Tipo tipoFestivo = obtenerOCrearTipo(3, "Día festivo");

            // Una sola llamada HTTP para obtener todos los festivos del año en memoria
            List<FestivoDto> festivos = festivoServicioExterno.obtenerFestivos(anio);
            Map<String, String> mapaFestivos = new HashMap<>();
            for (FestivoDto festivo : festivos) {
                mapaFestivos.put(festivo.getFecha(), festivo.getFestivo());
            }

            // Reemplazar registros previos del año si ya fue generado antes
            calendarioRepositorio.eliminarPorAnio(anio);

            Calendar cal = Calendar.getInstance();
            cal.set(anio, Calendar.JANUARY, 1);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            String[] nombresDias = { "", "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado" };

            List<Calendario> diasAGuardar = new ArrayList<>();
            while (cal.get(Calendar.YEAR) == anio) {
                Date fechaActual = cal.getTime();
                String fechaStr = sdf.format(fechaActual);
                int diaSemana = cal.get(Calendar.DAY_OF_WEEK);

                Tipo tipoDia;
                String descripcion;

                if (mapaFestivos.containsKey(fechaStr)) {
                    tipoDia = tipoFestivo;
                    descripcion = mapaFestivos.get(fechaStr);
                } else if (diaSemana == Calendar.SATURDAY || diaSemana == Calendar.SUNDAY) {
                    tipoDia = tipoFinSemana;
                    descripcion = nombresDias[diaSemana];
                } else {
                    tipoDia = tipoLaboral;
                    descripcion = nombresDias[diaSemana];
                }

                diasAGuardar.add(new Calendario(0, fechaActual, tipoDia, descripcion));
                cal.add(Calendar.DAY_OF_MONTH, 1);
            }

            calendarioRepositorio.guardarTodos(diasAGuardar);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    @Override
    public List<Calendario> listar(int anio) {
        return calendarioRepositorio.listarPorAnio(anio);
    }
}
