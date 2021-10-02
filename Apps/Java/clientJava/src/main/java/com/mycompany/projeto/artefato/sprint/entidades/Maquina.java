package com.mycompany.projeto.artefato.sprint.entidades;

public class Maquina {

    private String id_maquina;
    private String nome;
    private String senha;
    private String fk_empresa;

    public Maquina(String id_maquina, String nome, String senha,
            String fk_empresa) {
        this.id_maquina = id_maquina;
        this.nome = nome;
        this.senha = senha;
        this.fk_empresa = fk_empresa;
    }
}
