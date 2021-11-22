package com.mycompany.client.java;

import java.util.List;
import com.mycompany.client.java.util.ConfigDB;
import java.util.ArrayList;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class MonitoringTypes {

    public static List<TiposMedicao> getTiposMedicao() {
        String sql = String.format(
                "SELECT tipo_medicao.tipo, medicao_limite, unidade, id_categoria_medicao as fk_categoria_medicao FROM categoria_medicao INNER JOIN tipo_medicao ON fk_tipo_medicao = id_tipo_medicao WHERE fk_maquina = %d",
                Monitoring.getPkMaquina());

        BeanPropertyRowMapper<TiposMedicao> bean = new BeanPropertyRowMapper<>(TiposMedicao.class);
        JdbcTemplate jdbcTemplate;
        try {
            jdbcTemplate = ConfigDB.getJdbcAWS();
        } catch (Exception e) {
            System.out.println("azure");
            jdbcTemplate = ConfigDB.getJdbcAzure();
        }
        return jdbcTemplate.query(sql, bean);
    }

    public static List<Double> getLimits() {
        List<Double> list = new ArrayList<Double>();
        List<TiposMedicao> array = getTiposMedicao();
        for (TiposMedicao tipo : array) {
            list.add(tipo.getMedicaoLimite());
        }
        return list;
    }

    public static List<String> getTypes() {
        List<String> list = new ArrayList<String>();
        List<TiposMedicao> array = getTiposMedicao();
        for (TiposMedicao tipo : array) {
            list.add(tipo.getTipo());
        }
        return list;
    }

}
