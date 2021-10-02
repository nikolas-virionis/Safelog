package com.mycompany.client.java.entidades;

import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Contato {
    private Integer fkUsuario;
    private Integer idContato;
    private String valor;
    private Integer fkFormaContato;

    public Contato(Integer fkUsuario, Integer idContato, String valor,
            Integer fk_forma_contato) {
        this.fkUsuario = fkUsuario;
        this.idContato = idContato;
        this.valor = valor;
        this.fkFormaContato = fkFormaContato;
    }
    
    public static List<Contato> selectAll(BasicDataSource dataSource){
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.query("SELECT * FROM contato",
                new BeanPropertyRowMapper(Contato.class));
    }
}
