package com.mycompany.projeto.artefato.sprint.entidades;

public class Medicao {
    private Integer id_medicao;
    private Double valor;
    private String tipo;
    private String data_medicao;
    private Integer fk_categoria_medicao;

    public Medicao(Integer id_medicao, Double valor, String tipo,
            String data_medicao, Integer fk_categoria_medicao) {
        this.id_medicao = id_medicao;
        this.valor = valor;
        this.tipo = tipo;
        this.data_medicao = data_medicao;
        this.fk_categoria_medicao = fk_categoria_medicao;
    }
}
