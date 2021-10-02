package com.mycompany.client.java.entidades;

import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Empresa {
    private String idEmpresa;
    private String nome;
    private String pais;
    private String cidade;
    private Integer fkStaff;

    public Empresa(String idEmpresa, String nome, String pais, String cidade,
            Integer fkStaff) {
        this.idEmpresa = idEmpresa;
        this.nome = nome;
        this.pais = pais;
        this.cidade = cidade;
        this.fkStaff = fkStaff;
    }
    
    public static List<Empresa> selectAll(BasicDataSource dataSource){
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.query("SELECT * FROM empresa",
                new BeanPropertyRowMapper(Empresa.class));
    }
}
