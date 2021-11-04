package com.mycompany.client.java.entidades;

import java.util.List;

import com.mycompany.client.java.ConfigDB;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class DadosMaquina {

    private Integer idDadosMaquina;
    private String so;
    private String arquitetura;
    private String fabricante;
    private Integer fkMaquina;

    public DadosMaquina(Integer idDadosMaquina, String so, String arquitetura, String fabricante, Integer fkMaquina) {
        this.idDadosMaquina = idDadosMaquina;
        this.so = so;
        this.arquitetura = arquitetura;
        this.fabricante = fabricante;
        this.fkMaquina = fkMaquina;
    }

    public DadosMaquina() {
    }

    public Integer getFkMaquina() {
        return fkMaquina;
    }

    public void setFkMaquina(Integer fkMaquina) {
        this.fkMaquina = fkMaquina;
    }

    public String getFabricante() {
        return fabricante;
    }

    public void setFabricante(String fabricante) {
        this.fabricante = fabricante;
    }

    public String getArquitetura() {
        return arquitetura;
    }

    public void setArquitetura(String arquitetura) {
        this.arquitetura = arquitetura;
    }

    public String getSo() {
        return so;
    }

    public void setSo(String so) {
        this.so = so;
    }

    public Integer getIdDadosMaquina() {
        return idDadosMaquina;
    }

    public void setIdDadosMaquina(Integer idDadosMaquina) {
        this.idDadosMaquina = idDadosMaquina;
    }

    public static List<DadosMaquina> selectAll() {
        JdbcTemplate jdbcTemplate = ConfigDB.getJdbc();
        return jdbcTemplate.query("SELECT * FROM dados_maquina", new BeanPropertyRowMapper<>(DadosMaquina.class));
    }

}
