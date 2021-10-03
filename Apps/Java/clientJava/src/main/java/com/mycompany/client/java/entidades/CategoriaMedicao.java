package com.mycompany.client.java.entidades;

import com.mycompany.client.java.ConfigDB;
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

    public CategoriaMedicao() {
    }

    public Integer getIdCategoriaMedicao() {
        return idCategoriaMedicao;
    }

    public void setIdCategoriaMedicao(Integer idCategoriaMedicao) {
        this.idCategoriaMedicao = idCategoriaMedicao;
    }

    public Double getMedicaoLimite() {
        return medicaoLimite;
    }

    public void setMedicaoLimite(Double medicaoLimite) {
        this.medicaoLimite = medicaoLimite;
    }

    public String getFkMaquina() {
        return fkMaquina;
    }

    public void setFkMaquina(String fkMaquina) {
        this.fkMaquina = fkMaquina;
    }

    public Integer getFkTipoMedicao() {
        return fkTipoMedicao;
    }

    public void setFkTipoMedicao(Integer fkTipoMedicao) {
        this.fkTipoMedicao = fkTipoMedicao;
    }
    public static List<CategoriaMedicao> selectAll() {
        JdbcTemplate jdbcTemplate = ConfigDB.getJdbc();
        return jdbcTemplate.query("SELECT * FROM categoria_medicao",
                new BeanPropertyRowMapper(CategoriaMedicao.class));
    }
}
