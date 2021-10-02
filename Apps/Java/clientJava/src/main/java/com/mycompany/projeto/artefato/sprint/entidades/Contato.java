package com.mycompany.projeto.artefato.sprint.entidades;

public class Contato {
    private Integer fk_usuario;
    private Integer id_contato;
    private String valor;
    private Integer fk_forma_contato;

    public Contato(Integer fk_usuario, Integer id_contato, String valor,
            Integer fk_forma_contato) {
        this.fk_usuario = fk_usuario;
        this.id_contato = id_contato;
        this.valor = valor;
        this.fk_forma_contato = fk_forma_contato;
    }
}
