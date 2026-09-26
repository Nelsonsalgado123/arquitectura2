package monedas.api.dominio.entidades;

import java.util.Date;

public class Calendario {
    private int id;
    private Date fecha;
    private int idTipo;
    private String descripcion;

    public Calendario() {
    }

    public Calendario(int id, Date fecha, int idTipo, String descripcion) {
        this.id = id;
        this.fecha = fecha;
        this.idTipo = idTipo;
        this.descripcion = descripcion;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public int getIdTipo() {
        return idTipo;
    }

    public void setIdTipo(int idTipo) {
        this.idTipo = idTipo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
