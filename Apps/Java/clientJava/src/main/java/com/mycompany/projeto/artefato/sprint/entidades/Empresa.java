package com.mycompany.projeto.artefato.sprint.entidades;

public class Empresa {
    private String id_empresa;
    private String nome;
    private String pais;
    private String cidade;
    private Integer fk__staff;

    public Empresa(String id_empresa, String nome, String pais, String cidade,
            Integer fk__staff) {
        this.id_empresa = id_empresa;
        this.nome = nome;
        this.pais = pais;
        this.cidade = cidade;
        this.fk__staff = fk__staff;
    }
}
