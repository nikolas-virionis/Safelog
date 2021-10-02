package com.mycompany.projeto.artefato.sprint.entidades;

import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class CategoriaMedicao {
    private Integer idCategoriaMedicao;
    private Double medicaoLimite;
    private String fkMaquina;
    private Integer fkTipoMedicao;

    public CategoriaMedicao(Integer idCategoriaMedicao, Double medicaoLimite,
            String fkMaquina, Integer fkTipoMedicao) {
        this.idCategoriaMedicao = idCategoriaMedicao;
        this.medicaoLimite = medicaoLimite;
        this.fkMaquina = fkMaquina;
        this.fkTipoMedicao = fkTipoMedicao;
    }
    public List<CategoriaMedicao> selectAll(BasicDataSource dataSource){
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.query("SELECT * FROM categoria_medicao",
                new BeanPropertyRowMapper(CategoriaMedicao.class));
    }
}
