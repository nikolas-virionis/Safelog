package com.mycompany.projeto.artefato.sprint.entidades;

import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Medicao {
    private Integer idMedicao;
    private Double valor;
    private String tipo;
    private String dataMedicao;
    private Integer fkCategoriaMedicao;

    public Medicao(Integer idMedicao, Double valor, String tipo,
            String dataMedicao, Integer fkCategoriaMedicao) {
        this.idMedicao = idMedicao;
        this.valor = valor;
        this.tipo = tipo;
        this.dataMedicao = dataMedicao;
        this.fkCategoriaMedicao = fkCategoriaMedicao;
    }
    public List<Medicao> selectAll(BasicDataSource dataSource) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.query("SELECT * FROM medicao",
                new BeanPropertyRowMapper(Medicao.class));
    }
}
