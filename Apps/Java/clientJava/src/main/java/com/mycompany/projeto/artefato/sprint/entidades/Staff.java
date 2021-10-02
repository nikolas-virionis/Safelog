package com.mycompany.projeto.artefato.sprint.entidades;

public class Staff {
    private Integer id_staff;
    private String nome;
    private String email;
    private String senha;
    private String token;

    public Staff(Integer id_staff, String nome, String email, String senha,
            String token) {
        this.id_staff = id_staff;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.token = token;
    }
            
}
