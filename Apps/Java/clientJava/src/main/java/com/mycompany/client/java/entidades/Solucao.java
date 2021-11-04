package com.mycompany.client.java.entidades;

import java.util.List;

import com.mycompany.client.java.ConfigDB;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Solucao {

    private Integer idSolucao;
    private String titulo;
    private String descricao;
    private String dataSolucao;
    private String eficacia;
    private Integer fkUsuario;
    private Integer fkChamado;

    public Solucao(Integer idSolucao, String titulo, String descricao, String dataSolucao, String eficacia,
            Integer fkUsuario, Integer fkChamado) {
        this.idSolucao = idSolucao;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataSolucao = dataSolucao;
        this.eficacia = eficacia;
        this.fkUsuario = fkUsuario;
        this.fkChamado = fkChamado;
    }

    public Solucao() {
    }

    public Integer getFkChamado() {
        return fkChamado;
    }

    public void setFkChamado(Integer fkChamado) {
        this.fkChamado = fkChamado;
    }

    public Integer getFkUsuario() {
        return fkUsuario;
    }

    public void setFkUsuario(Integer fkUsuario) {
        this.fkUsuario = fkUsuario;
    }

    public String getEficacia() {
        return eficacia;
    }

    public void setEficacia(String eficacia) {
        this.eficacia = eficacia;
    }

    public String getDataSolucao() {
        return dataSolucao;
    }

    public void setDataSolucao(String dataSolucao) {
        this.dataSolucao = dataSolucao;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Integer getIdSolucao() {
        return idSolucao;
    }

    public void setIdSolucao(Integer idSolucao) {
        this.idSolucao = idSolucao;
    }

    public static List<Solucao> selectAll() {
        JdbcTemplate jdbcTemplate = ConfigDB.getJdbc();
        return jdbcTemplate.query("SELECT * FROM solucao", new BeanPropertyRowMapper<>(Solucao.class));
    }

}
