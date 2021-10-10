package com.mycompany.client.java.entidades;

import com.mycompany.client.java.ConfigDB;
import java.util.List;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Analytics {
    private Integer idAnalytics;
    private Double cpu;
    private Double ram;
    private Double disco;
    private String dataMedicao;
    private Integer fkMaquinaAnalytics;

    public Analytics(Integer idAnalytics, Double cpu, Double ram, Double disco, String dataMedicao,
            Integer fkMaquinaAnalytics) {
        this.idAnalytics = idAnalytics;
        this.cpu = cpu;
        this.ram = ram;
        this.disco = disco;
        this.dataMedicao = dataMedicao;
        this.fkMaquinaAnalytics = fkMaquinaAnalytics;
    }

    public Analytics() {
    }

    public Integer getIdAnalytics() {
        return idAnalytics;
    }

    public Double getCpu() {
        return cpu;
    }

    public Double getRam() {
        return ram;
    }

    public Double getDisco() {
        return disco;
    }

    public String getDataMedicao() {
        return dataMedicao;
    }

    public Integer getFkMaquinaAnalytics() {
        return fkMaquinaAnalytics;
    }

    public static List<Analytics> selectAll() {
        JdbcTemplate jdbcTemplate = ConfigDB.getJdbc();
        return jdbcTemplate.query("SELECT * FROM analytics", new BeanPropertyRowMapper<>(Analytics.class));
    }

}
