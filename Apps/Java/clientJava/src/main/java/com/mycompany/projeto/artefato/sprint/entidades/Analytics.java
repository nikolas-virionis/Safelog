package com.mycompany.projeto.artefato.sprint.entidades;

public class Analytics {
    private Integer id_analytics;
    private Double cpu;
    private Double ram;
    private Double disco;
    private String data_medicao;
    private Integer fk_maquina_analytics;

    public Analytics(Integer id_analytics, Double cpu, Double ram, Double disco,
            String data_medicao, Integer fk_maquina_analytics) {
        this.id_analytics = id_analytics;
        this.cpu = cpu;
        this.ram = ram;
        this.disco = disco;
        this.data_medicao = data_medicao;
        this.fk_maquina_analytics = fk_maquina_analytics;
    }
    
}
