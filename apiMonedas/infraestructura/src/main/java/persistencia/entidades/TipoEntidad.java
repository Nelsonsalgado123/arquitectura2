package monedas.api.infraestructura.persistencia.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "Tipo")
public class TipoEntidad {

    @Id
    @Column(name = "id")
    private int id; // Usaremos id manual según el PDF o podemos usar auto numérico. El PDF pone Tipo: Id, Tipo.

    @Column(name = "tipo", length = 100)
    private String tipo;

    public TipoEntidad() {
    }

    public TipoEntidad(int id, String tipo) {
        this.id = id;
        this.tipo = tipo;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}
