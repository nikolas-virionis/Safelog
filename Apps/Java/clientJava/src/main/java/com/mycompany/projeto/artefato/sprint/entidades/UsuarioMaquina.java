package com.mycompany.projeto.artefato.sprint.entidades;

public class UsuarioMaquina {

    private Integer id_usuario_maquina;
    private Character responsavel;
    private Integer fk_usuario;
    private String fk_maquina;

    public UsuarioMaquina(Integer id_usuario_maquina, Character responsavel,
            Integer fk_usuario, String fk_maquina) {
        this.id_usuario_maquina = id_usuario_maquina;
        this.responsavel = responsavel;
        this.fk_usuario = fk_usuario;
        this.fk_maquina = fk_maquina;
    }
}
