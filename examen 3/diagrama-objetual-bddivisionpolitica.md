```mermaid
classDiagram
    class Pais {
        +int id
        +string nombre
        +string componente
        +string tipoRegion
        +string codigoAlfa2
        +string codigoAlfa3
        +array regiones
    }

    class Region {
        +string nombre
        +string codigo
        +number area
        +int poblacion
        +array ciudades
    }

    class Ciudad {
        +int codigo
        +string nombre
        +boolean capitalRegion
        +boolean capitalPais
    }

    Pais "1" *-- "0..*" Region : regiones
    Region "1" *-- "0..*" Ciudad : ciudades