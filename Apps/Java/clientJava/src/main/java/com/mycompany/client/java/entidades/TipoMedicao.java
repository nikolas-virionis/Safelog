package com.mycompany.client.java.entidades;

import java.util.List;
import com.mycompany.client.java.util.ConfigDB;
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

    public Integer getIdTipoMedicao() {
        return idTipoMedicao;
    }

    public void setIdTipoMedicao(Integer idTipoMedicao) {
        this.idTipoMedicao = idTipoMedicao;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getUnidade() {
        return unidade;
    }

    public void setUnidade(String unidade) {
        this.unidade = unidade;
    }

    public TipoMedicao() {
    }

    public static List<TipoMedicao> selectAll() {
        JdbcTemplate jdbcTemplate = ConfigDB.getJdbc();
        return jdbcTemplate.query("SELECT * FROM tipo_medicao", new BeanPropertyRowMapper<>(TipoMedicao.class));
    }
}
