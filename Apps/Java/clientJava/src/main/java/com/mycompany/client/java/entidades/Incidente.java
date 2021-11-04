package com.mycompany.client.java.entidades;

import java.util.List;

import com.mycompany.client.java.ConfigDB;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Incidente {

    private Integer idIncidente;
    private Integer fkMedicao;

    public Incidente(Integer idIncidente, Integer fkMedicao) {
        this.idIncidente = idIncidente;
        this.fkMedicao = fkMedicao;
    }

    public Incidente() {
    }

    public Integer getIdIncidente() {
        return idIncidente;
    }

    public void setIdIncidente(Integer idIncidente) {
        this.idIncidente = idIncidente;
    }

    public Integer getFkMedicao() {
        return fkMedicao;
    }

    public void setFkMedicao(Integer fkMedicao) {
        this.fkMedicao = fkMedicao;
    }

    public static List<Incidente> selectAll() {
        JdbcTemplate jdbcTemplate = ConfigDB.getJdbc();
        return jdbcTemplate.query("SELECT * FROM incidente", new BeanPropertyRowMapper<>(Incidente.class));
    }
}
