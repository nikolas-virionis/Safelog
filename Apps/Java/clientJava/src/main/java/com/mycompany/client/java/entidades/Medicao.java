package com.mycompany.client.java.entidades;

import java.util.List;
import com.mycompany.client.java.util.ConfigDB;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Medicao {
    private Integer idMedicao;
    private Double valor;
    private String tipo;
    private String dataMedicao;
    private Integer fkCategoriaMedicao;

    public Medicao(Integer idMedicao, Double valor, String tipo, String dataMedicao, Integer fkCategoriaMedicao) {
        this.idMedicao = idMedicao;
        this.valor = valor;
        this.tipo = tipo;
        this.dataMedicao = dataMedicao;
        this.fkCategoriaMedicao = fkCategoriaMedicao;
    }

    public Medicao(Double valor, String tipo, String dataMedicao, Integer fkCategoriaMedicao) {
        this.valor = valor;
        this.tipo = tipo;
        this.dataMedicao = dataMedicao;
        this.fkCategoriaMedicao = fkCategoriaMedicao;
    }

    public Integer getIdMedicao() {
        return idMedicao;
    }

    public void setIdMedicao(Integer idMedicao) {
        this.idMedicao = idMedicao;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDataMedicao() {
        return dataMedicao;
    }

    public void setDataMedicao(String dataMedicao) {
        this.dataMedicao = dataMedicao;
    }

    public Integer getFkCategoriaMedicao() {
        return fkCategoriaMedicao;
    }

    public void setFkCategoriaMedicao(Integer fkCategoriaMedicao) {
        this.fkCategoriaMedicao = fkCategoriaMedicao;
    }

    public Medicao() {
    }

    public static List<Medicao> selectAll() {
        JdbcTemplate jdbcTemplate;
        try {
            jdbcTemplate = ConfigDB.getJdbcAWS();
        } catch (Exception e) {
            System.out.println("azure");
            jdbcTemplate = ConfigDB.getJdbcAzure();
        }
        return jdbcTemplate.query("SELECT * FROM medicao", new BeanPropertyRowMapper<>(Medicao.class));
    }
}
