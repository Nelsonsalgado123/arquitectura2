```mermaid
erDiagram
    MONEDA {
        auto Id PK
        varchar Moneda
        varchar Sigla
        varchar Simbolo
        varchar Emisor
        blob Imagen
    }

    CAMBIO_MONEDA {
        auto Id PK
        int IdMoneda FK
        date Fecha
        double Cambio
    }

    PAIS {
        auto Id PK
        varchar Pais
        varchar CodigoAlfa2
        varchar CodigoAlfa3
        int IdMoneda FK
        blob Mapa
        blob Bandera
    }

    MONEDA ||--o{ CAMBIO_MONEDA : vale
    MONEDA ||--o{ PAIS : tranza