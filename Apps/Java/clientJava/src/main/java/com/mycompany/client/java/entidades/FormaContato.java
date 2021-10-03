package com.mycompany.client.java.entidades;

import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
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
    
    
    public static List<FormaContato> selectAll(BasicDataSource dataSource){
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.query("SELECT * FROM forma_contato",
                new BeanPropertyRowMapper(FormaContato.class));
    }
}
