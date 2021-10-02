package com.mycompany.projeto.artefato.sprint.entidades;

public class Usuario {
    private Integer id_usuario;
    private String nome;
    private String email;
    private String senha;
    private String cargo;
    private String token;
    private String fk_empresa;
    private Integer fk_supervisor;

    public Usuario(Integer id_usuario, String nome, String email, String senha,
            String cargo, String token, String fk_empresa, Integer fk_supervisor) {
        this.id_usuario = id_usuario;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.cargo = cargo;
        this.token = token;
        this.fk_empresa = fk_empresa;
        this.fk_supervisor = fk_supervisor;
    }
}
