package com.mycompany.client.java.entidades;

import java.util.List;
import com.mycompany.client.java.util.ConfigDB;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class CategoriaMedicao {
    private Integer idCategoriaMedicao;
    private Double medicaoLimite;
    private Integer fkMaquina;
    private Integer fkTipoMedicao;

    public CategoriaMedicao(Integer idCategoriaMedicao, Double medicaoLimite, Integer fkMaquina,
            Integer fkTipoMedicao) {
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

    public Integer getFkMaquina() {
        return fkMaquina;
    }

    public void setFkMaquina(Integer fkMaquina) {
        this.fkMaquina = fkMaquina;
    }

    public Integer getFkTipoMedicao() {
        return fkTipoMedicao;
    }

    public void setFkTipoMedicao(Integer fkTipoMedicao) {
        this.fkTipoMedicao = fkTipoMedicao;
    }

    public static List selectAll() {
        // JdbcTemplate jdbcTemplate;
        try {
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAWS();
            return jdbcTemplate.query("SELECT * FROM categoria_medicao",
                    new BeanPropertyRowMapper<>(CategoriaMedicao.class));
        } catch (Exception e) {
            System.out.println("azure");
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAzure();
            return jdbcTemplate.query("SELECT * FROM categoria_medicao",
                    new BeanPropertyRowMapper<>(CategoriaMedicao.class));
        }
    }
}
