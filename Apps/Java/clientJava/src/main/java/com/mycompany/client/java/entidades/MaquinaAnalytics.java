package com.mycompany.client.java.entidades;

import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class MaquinaAnalytics {

    private Integer idMaquinaAnalytics;
    private Double limiteCpu;
    private Double limiteRam;
    private Double limiteDisco;
    private String fkMaquina;

    public MaquinaAnalytics(Integer idMaquinaAnalytics, Double limiteCpu,
            Double limiteRam, Double limiteDisco, String fkMaquina) {
        this.idMaquinaAnalytics = idMaquinaAnalytics;
        this.limiteCpu = limiteCpu;
        this.limiteRam = limiteRam;
        this.limiteDisco = limiteDisco;
        this.fkMaquina = fkMaquina;
    }

    public static List<MaquinaAnalytics> selectAll(BasicDataSource dataSource) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.query("SELECT * FROM maquina_analytics",
                new BeanPropertyRowMapper(MaquinaAnalytics.class));
    }
}
