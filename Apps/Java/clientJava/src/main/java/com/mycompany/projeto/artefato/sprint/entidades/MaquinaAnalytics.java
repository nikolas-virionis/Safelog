package com.mycompany.projeto.artefato.sprint.entidades;

public class MaquinaAnalytics {
    private Integer id_maquina_analytics;
    private Double limite_cpu;
    private Double limite_ram;
    private Double limite_disco;
    private String fk_maquina;

    public MaquinaAnalytics(Integer id_maquina_analytics, Double limite_cpu,
            Double limite_ram, Double limite_disco, String fk_maquina) {
        this.id_maquina_analytics = id_maquina_analytics;
        this.limite_cpu = limite_cpu;
        this.limite_ram = limite_ram;
        this.limite_disco = limite_disco;
        this.fk_maquina = fk_maquina;
    }
}
