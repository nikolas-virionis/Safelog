package com.mycompany.client.java;

public class TiposMedicao {

    private String tipo;
    private Double medicaoLimite;
    private String unidade;
    private Integer fkCategoriaMedicao;

    public TiposMedicao(String tipo, Double medicaoLimite, String unidade, Integer fkCategoriaMedicao) {
        this.tipo = tipo;
        this.medicaoLimite = medicaoLimite;
        this.unidade = unidade;
        this.fkCategoriaMedicao = fkCategoriaMedicao;
    }

    public Integer getFkCategoriaMedicao() {
        return fkCategoriaMedicao;
    }

    public void setFkCategoriaMedicao(Integer fkCategoriaMedicao) {
        this.fkCategoriaMedicao = fkCategoriaMedicao;
    }

    public String getUnidade() {
        return unidade;
    }

    public void setUnidade(String unidade) {
        this.unidade = unidade;
    }

    public Double getMedicaoLimite() {
        return medicaoLimite;
    }

    public void setMedicaoLimite(Double medicaoLimite) {
        this.medicaoLimite = medicaoLimite;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public TiposMedicao() {

    }

    @Override
    public String toString() {
        return String.format("TiposMedicao: %s\n\tMedição Limite: %.2f%s\n", this.tipo, this.medicaoLimite,
                this.unidade);
    }

}
