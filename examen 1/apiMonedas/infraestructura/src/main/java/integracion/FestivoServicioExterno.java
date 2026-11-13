package monedas.api.infraestructura.integracion;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import monedas.api.core.integracion.IFestivoServicioExterno;
import monedas.api.dominio.dtos.FestivoDto;

@Service
public class FestivoServicioExterno implements IFestivoServicioExterno {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${servicioexterno.festivos.url}")
    private String urlBase;

    @Override
    public List<FestivoDto> obtenerFestivos(int anio) {
        String url = urlBase + "/obtener/" + anio;
        ResponseEntity<List<FestivoDto>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<FestivoDto>>() {}
        );
        return response.getBody() != null ? response.getBody() : Collections.emptyList();
    }
}
