package com.mycompany.projeto.artefato.sprint.entidades;

public class TipoMedicao {
    private Integer id_tipo_medicao;
    private String tipo;
    private String unidade;

    public TipoMedicao(Integer id_tipo_medicao, String tipo, String unidade) {
        this.id_tipo_medicao = id_tipo_medicao;
        this.tipo = tipo;
        this.unidade = unidade;
    }
}
