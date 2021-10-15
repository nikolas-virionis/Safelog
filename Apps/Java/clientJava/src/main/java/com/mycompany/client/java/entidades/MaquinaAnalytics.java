package com.mycompany.client.java.entidades;

import com.mycompany.client.java.ConfigDB;
import java.util.List;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

@Deprecated
public class MaquinaAnalytics {

    private Integer idMaquinaAnalytics;
    private Double limiteCpu;
    private Double limiteRam;
    private Double limiteDisco;
    private String fkMaquina;

    public MaquinaAnalytics(Integer idMaquinaAnalytics, Double limiteCpu, Double limiteRam, Double limiteDisco,
            String fkMaquina) {
        this.idMaquinaAnalytics = idMaquinaAnalytics;
        this.limiteCpu = limiteCpu;
        this.limiteRam = limiteRam;
        this.limiteDisco = limiteDisco;
        this.fkMaquina = fkMaquina;
    }

    public Integer getIdMaquinaAnalytics() {
        return idMaquinaAnalytics;
    }

    public void setIdMaquinaAnalytics(Integer idMaquinaAnalytics) {
        this.idMaquinaAnalytics = idMaquinaAnalytics;
    }

    public Double getLimiteCpu() {
        return limiteCpu;
    }

    public void setLimiteCpu(Double limiteCpu) {
        this.limiteCpu = limiteCpu;
    }

    public Double getLimiteRam() {
        return limiteRam;
    }

    public void setLimiteRam(Double limiteRam) {
        this.limiteRam = limiteRam;
    }

    public Double getLimiteDisco() {
        return limiteDisco;
    }

    public void setLimiteDisco(Double limiteDisco) {
        this.limiteDisco = limiteDisco;
    }

    public String getFkMaquina() {
        return fkMaquina;
    }

    public void setFkMaquina(String fkMaquina) {
        this.fkMaquina = fkMaquina;
    }

    public MaquinaAnalytics() {
    }

    public static List<MaquinaAnalytics> selectAll() {
        JdbcTemplate jdbcTemplate = ConfigDB.getJdbc();
        return jdbcTemplate.query("SELECT * FROM maquina_analytics", new BeanPropertyRowMapper<>(MaquinaAnalytics.class));
    }
}
