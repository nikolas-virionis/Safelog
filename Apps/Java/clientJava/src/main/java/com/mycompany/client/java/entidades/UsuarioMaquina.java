package com.mycompany.client.java.entidades;

import java.util.List;
import com.mycompany.client.java.util.ConfigDB;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class UsuarioMaquina {

    private Integer idUsuarioMaquina;
    private Character responsavel;
    private Integer fkUsuario;
    private Integer fkMaquina;

    public UsuarioMaquina(Integer idUsuarioMaquina, Character responsavel, Integer fkUsuario, Integer fkMaquina) {
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

    public Integer getFkMaquina() {
        return fkMaquina;
    }

    public void setFkMaquina(Integer fkMaquina) {
        this.fkMaquina = fkMaquina;
    }

    public static List<UsuarioMaquina> selectAll() {
        JdbcTemplate jdbcTemplate = ConfigDB.getJdbc();
        return jdbcTemplate.query("SELECT * FROM usuario_maquina", new BeanPropertyRowMapper<>(UsuarioMaquina.class));
    }
}
