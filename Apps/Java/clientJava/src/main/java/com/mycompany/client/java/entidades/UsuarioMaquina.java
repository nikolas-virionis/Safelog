package com.mycompany.client.java.entidades;

import com.mycompany.client.java.ConfigDB;
import java.util.List;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class UsuarioMaquina {

    private Integer idUsuarioMaquina;
    private Character responsavel;
    private Integer fkUsuario;
    private String fkMaquina;

    public UsuarioMaquina(Integer idUsuarioMaquina, Character responsavel, Integer fkUsuario, String fkMaquina) {
        this.idUsuarioMaquina = idUsuarioMaquina;
        this.responsavel = responsavel;
        this.fkUsuario = fkUsuario;
        this.fkMaquina = fkMaquina;
    }

    public UsuarioMaquina() {
    }

    public Integer getIdUsuarioMaquina() {
        return idUsuarioMaquina;
    }

    public void setIdUsuarioMaquina(Integer idUsuarioMaquina) {
        this.idUsuarioMaquina = idUsuarioMaquina;
    }

    public Character getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(Character responsavel) {
        this.responsavel = responsavel;
    }

    public Integer getFkUsuario() {
        return fkUsuario;
    }

    public void setFkUsuario(Integer fkUsuario) {
        this.fkUsuario = fkUsuario;
    }

    public String getFkMaquina() {
        return fkMaquina;
    }

    public void setFkMaquina(String fkMaquina) {
        this.fkMaquina = fkMaquina;
    }

    public static List<UsuarioMaquina> selectAll() {
        JdbcTemplate jdbcTemplate = ConfigDB.getJdbc();
        return jdbcTemplate.query("SELECT * FROM usuario_maquina", new BeanPropertyRowMapper(UsuarioMaquina.class));
    }
}
