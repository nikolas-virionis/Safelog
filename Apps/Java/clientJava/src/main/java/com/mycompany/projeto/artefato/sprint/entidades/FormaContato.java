package com.mycompany.projeto.artefato.sprint.entidades;

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
    
    
    public List<FormaContato> selectAll(BasicDataSource dataSource){
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.query("SELECT * FROM forma_contato",
                new BeanPropertyRowMapper(FormaContato.class));
    }
}
