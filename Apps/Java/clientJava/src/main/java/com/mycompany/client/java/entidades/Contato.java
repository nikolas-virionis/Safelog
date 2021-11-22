package com.mycompany.client.java.entidades;

import java.util.List;
import com.mycompany.client.java.util.ConfigDB;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Contato {
    private Integer fkUsuario;
    private Integer idContato;
    private String valor;
    private Integer fkFormaContato;

    public Contato(Integer fkUsuario, Integer idContato, String valor, Integer fkFormaContato) {
        this.fkUsuario = fkUsuario;
        this.idContato = idContato;
        this.valor = valor;
        this.fkFormaContato = fkFormaContato;
    }

    public Contato() {
    }

    public Integer getFkUsuario() {
        return fkUsuario;
    }

    public void setFkUsuario(Integer fkUsuario) {
        this.fkUsuario = fkUsuario;
    }

    public Integer getIdContato() {
        return idContato;
    }

    public void setIdContato(Integer idContato) {
        this.idContato = idContato;
    }

    public String getValor() {
        return valor;
    }

    public void setValor(String valor) {
        this.valor = valor;
    }

    public Integer getFkFormaContato() {
        return fkFormaContato;
    }

    public void setFkFormaContato(Integer fkFormaContato) {
        this.fkFormaContato = fkFormaContato;
    }

    public static List<Contato> selectAll() {
        // jdbcTemplate;
        try {
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAWS();
            return jdbcTemplate.query("SELECT * FROM contato", new BeanPropertyRowMapper<>(Contato.class));
        } catch (Exception e) {
            System.out.println("azure");
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAzure();
            return jdbcTemplate.query("SELECT * FROM contato", new BeanPropertyRowMapper<>(Contato.class));
        }
    }
}
