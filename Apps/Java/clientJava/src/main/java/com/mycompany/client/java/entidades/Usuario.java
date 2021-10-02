package com.mycompany.client.java.entidades;

import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Usuario {

    private Integer idUsuario;
    private String nome;
    private String email;
    private String senha;
    private String cargo;
    private String token;
    private String fkEmpresa;
    private Integer fkSupervisor;

    public Usuario(Integer idUsuario, String nome, String email, String senha,
            String cargo, String token, String fkEmpresa, Integer fkSupervisor) {
        this.idUsuario = idUsuario;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.cargo = cargo;
        this.token = token;
        this.fkEmpresa = fkEmpresa;
        this.fkSupervisor = fkSupervisor;
    }

    public static List<Usuario> selectAll(BasicDataSource dataSource) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.query("SELECT * FROM usuario",
                new BeanPropertyRowMapper(Usuario.class));
    }
}
