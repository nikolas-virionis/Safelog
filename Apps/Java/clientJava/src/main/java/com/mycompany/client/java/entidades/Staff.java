package com.mycompany.client.java.entidades;

import java.util.List;
import com.mycompany.client.java.util.ConfigDB;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Staff {
    private Integer idStaff;
    private String nome;
    private String email;
    private String senha;
    private String token;

    public Staff(Integer idStaff, String nome, String email, String senha, String token) {
        this.idStaff = idStaff;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.token = token;
    }

    public Integer getIdStaff() {
        return idStaff;
    }

    public void setIdStaff(Integer idStaff) {
        this.idStaff = idStaff;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Staff() {
    }

    public static List<Staff> selectAll() {
        JdbcTemplate jdbcTemplate;
        try {
            jdbcTemplate = ConfigDB.getJdbcAWS();
        } catch (Exception e) {
            System.out.println("azure");
            jdbcTemplate = ConfigDB.getJdbcAzure();
        }
        return jdbcTemplate.query("SELECT * FROM staff", new BeanPropertyRowMapper<>(Staff.class));
    }

}
