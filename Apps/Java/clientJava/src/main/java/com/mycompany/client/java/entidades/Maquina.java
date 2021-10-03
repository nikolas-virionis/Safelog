package com.mycompany.client.java.entidades;

import com.mycompany.client.java.ConfigDB;
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

    public String getIdMaquina() {
        return idMaquina;
    }

    public void setIdMaquina(String idMaquina) {
        this.idMaquina = idMaquina;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getFkEmpresa() {
        return fkEmpresa;
    }

    public void setFkEmpresa(String fkEmpresa) {
        this.fkEmpresa = fkEmpresa;
    }

    public Maquina() {
    }
    public static List<Maquina> selectAll() {
        JdbcTemplate jdbcTemplate = ConfigDB.getJdbc();
        return jdbcTemplate.query("SELECT * FROM maquina",
                new BeanPropertyRowMapper(Maquina.class));
    }
}
