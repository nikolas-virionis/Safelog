package com.mycompany.client.java.entidades;

import java.util.List;
import com.mycompany.client.java.util.ConfigDB;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Empresa {
    private String idEmpresa;
    private String nome;
    private String pais;
    private String cidade;
    private String foto;
    private Integer fkStaff;

    public Empresa(String idEmpresa, String nome, String pais, String cidade, String foto, Integer fkStaff) {
        this.idEmpresa = idEmpresa;
        this.nome = nome;
        this.pais = pais;
        this.cidade = cidade;
        this.fkStaff = fkStaff;
        this.foto = foto;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
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
        JdbcTemplate jdbcTemplate;
        try {
            jdbcTemplate = ConfigDB.getJdbcAWS();
        } catch (Exception e) {
            System.out.println("azure");
            jdbcTemplate = ConfigDB.getJdbcAzure();
        }
        return jdbcTemplate.query("SELECT * FROM empresa", new BeanPropertyRowMapper<>(Empresa.class));
    }
}
