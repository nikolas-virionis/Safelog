package com.mycompany.projeto.artefato.sprint.entidades;

import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Analytics {
    private Integer idAnalytics;
    private Double cpu;
    private Double ram;
    private Double disco;
    private String dataMedicao;
    private Integer fkMaquinaAnalytics;

    public Analytics(Integer idAnalytics, Double cpu, Double ram, Double disco,
            String data_medicao, Integer fkMaquinaAnalytics) {
        this.idAnalytics = idAnalytics;
        this.cpu = cpu;
        this.ram = ram;
        this.disco = disco;
        this.dataMedicao = dataMedicao;
        this.fkMaquinaAnalytics = fkMaquinaAnalytics;
    }
    
    public List<Analytics> selectAll(BasicDataSource dataSource){
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.query("SELECT * FROM analytics",
                new BeanPropertyRowMapper(Analytics.class));
    }
    
}
