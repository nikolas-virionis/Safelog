package com.mycompany.client.java.entidades;

import java.util.List;

import com.mycompany.client.java.ConfigDB;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Chamado {

    private Integer idChamado;
    private String titulo;
    private String descricao;
    private String dataAbertura;
    private String statusChamado;
    private String prioridade;
    private Character automatico;
    private Integer fkUsuario;
    private Integer fkCategoriaMedicao;

    public Chamado(Integer idChamado, String titulo, String descricao, String dataAbertura, String statusChamado,
            String prioridade, Character automatico, Integer fkUsuario, Integer fkCategoriaMedicao) {
        this.idChamado = idChamado;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataAbertura = dataAbertura;
        this.statusChamado = statusChamado;
        this.prioridade = prioridade;
        this.automatico = automatico;
        this.fkUsuario = fkUsuario;
        this.fkCategoriaMedicao = fkCategoriaMedicao;
    }

    public Chamado() {
    }

    public Integer getFkCategoriaMedicao() {
        return fkCategoriaMedicao;
    }

    public void setFkCategoriaMedicao(Integer fkCategoriaMedicao) {
        this.fkCategoriaMedicao = fkCategoriaMedicao;
    }

    public Integer getFkUsuario() {
        return fkUsuario;
    }

    public void setFkUsuario(Integer fkUsuario) {
        this.fkUsuario = fkUsuario;
    }

    public Character getAutomatico() {
        return automatico;
    }

    public void setAutomatico(Character automatico) {
        this.automatico = automatico;
    }

    public String getPrioridade() {
        return prioridade;
    }

    public void setPrioridade(String prioridade) {
        this.prioridade = prioridade;
    }

    public String getStatusChamado() {
        return statusChamado;
    }

    public void setStatusChamado(String statusChamado) {
        this.statusChamado = statusChamado;
    }

    public String getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(String dataAbertura) {
        this.dataAbertura = dataAbertura;
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

    public Integer getIdChamado() {
        return idChamado;
    }

    public void setIdChamado(Integer idChamado) {
        this.idChamado = idChamado;
    }

    public static List<Chamado> selectAll() {
        JdbcTemplate jdbcTemplate = ConfigDB.getJdbc();
        return jdbcTemplate.query("SELECT * FROM chamado", new BeanPropertyRowMapper<>(Chamado.class));
    }

}
