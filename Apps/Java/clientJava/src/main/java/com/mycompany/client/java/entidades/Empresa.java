package com.mycompany.client.java.entidades;

import com.mycompany.client.java.ConfigDB;
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

    public Empresa() {
    }

    public String getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(String idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public Integer getFkStaff() {
        return fkStaff;
    }

    public void setFkStaff(Integer fkStaff) {
        this.fkStaff = fkStaff;
    }
    
    public static List<Empresa> selectAll() {
        JdbcTemplate jdbcTemplate = ConfigDB.getJdbc();
        return jdbcTemplate.query("SELECT * FROM empresa",
                new BeanPropertyRowMapper(Empresa.class));
    }
}
