package com.mycompany.projeto.artefato.sprint.entidades;

import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Maquina {

    private String idMaquina;
    private String nome;
    private String senha;
    private String fkEmpresa;

    public Maquina(String idMaquina, String nome, String senha,
            String fkEmpresa) {
        this.idMaquina = idMaquina;
        this.nome = nome;
        this.senha = senha;
        this.fkEmpresa = fkEmpresa;
    }
    public List<Maquina> selectAll(BasicDataSource dataSource){
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.query("SELECT * FROM maquina",
                new BeanPropertyRowMapper(Maquina.class));
    }
}
