package com.mycompany.client.java.entidades;

import java.util.List;
import com.mycompany.client.java.util.ConfigDB;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class FormaContato {
    private Integer idFormaContato;
    private String nome;

    public FormaContato(Integer idFormaContato, String nome) {
        this.idFormaContato = idFormaContato;
        this.nome = nome;
    }

    public FormaContato() {
    }

    public Integer getIdFormaContato() {
        return idFormaContato;
    }

    public void setIdFormaContato(Integer idFormaContato) {
        this.idFormaContato = idFormaContato;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public static List<FormaContato> selectAll() {
        JdbcTemplate jdbcTemplate = ConfigDB.getJdbc();
        return jdbcTemplate.query("SELECT * FROM forma_contato", new BeanPropertyRowMapper<>(FormaContato.class));
    }
}
