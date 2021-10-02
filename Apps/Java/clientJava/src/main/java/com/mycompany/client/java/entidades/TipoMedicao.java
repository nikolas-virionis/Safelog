package com.mycompany.client.java.entidades;

import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class TipoMedicao {
    private Integer idTipoMedicao;
    private String tipo;
    private String unidade;

    public TipoMedicao(Integer idTipoMedicao, String tipo, String unidade) {
        this.idTipoMedicao = idTipoMedicao;
        this.tipo = tipo;
        this.unidade = unidade;
    }
    public static List<TipoMedicao> selectAll(BasicDataSource dataSource) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.query("SELECT * FROM tipo_medicao",
                new BeanPropertyRowMapper(TipoMedicao.class));
    }
}
