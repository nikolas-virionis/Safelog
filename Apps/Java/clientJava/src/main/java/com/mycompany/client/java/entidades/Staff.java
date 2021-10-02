package com.mycompany.client.java.entidades;

import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Staff {
    private Integer idStaff;
    private String nome;
    private String email;
    private String senha;
    private String token;

    public Staff(Integer idStaff, String nome, String email, String senha,
            String token) {
        this.idStaff = idStaff;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.token = token;
    }
    public static List<Staff> selectAll(BasicDataSource dataSource) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.query("SELECT * FROM staff",
                new BeanPropertyRowMapper(Staff.class));
    }
            
}
