package com.mycompany.client.java.entity;

import java.util.List;
import com.mycompany.client.java.util.ConfigDB;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class ContactWay {
    private Integer idFormaContato;
    private String nome;

    public ContactWay(Integer idFormaContato, String nome) {
        this.idFormaContato = idFormaContato;
        this.nome = nome;
    }

    public ContactWay() {
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

    public static List<ContactWay> selectAll() {
        // jdbcTemplate;
        try {
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAWS();
            return jdbcTemplate.query("SELECT * FROM forma_contato", new BeanPropertyRowMapper<>(ContactWay.class));
        } catch (Exception e) {
            System.out.println("azure");
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAzure();
            return jdbcTemplate.query("SELECT * FROM forma_contato", new BeanPropertyRowMapper<>(ContactWay.class));
        }

    }
}
