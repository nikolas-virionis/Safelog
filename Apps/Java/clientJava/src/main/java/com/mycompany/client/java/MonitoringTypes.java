package com.mycompany.client.java;

import java.util.List;

import javax.management.monitor.Monitor;

import java.util.ArrayList;
// import com.mycompany.client.java.ConfigDB;
import com.mycompany.client.java.Monitoring;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.util.LinkedCaseInsensitiveMap;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.util.LinkedCaseInsensitiveMap;

public class MonitoringTypes {

    private static JdbcTemplate getJdbcTemplate() {
        return ConfigDB.getJdbc();
    }

    public static List<TiposMedicao> getObjectArray() throws DataAccessException {
        String sql = String.format(
                "SELECT tipo_medicao.tipo, medicao_limite, unidade FROM categoria_medicao INNER JOIN "
                        + "tipo_medicao ON fk_tipo_medicao = id_tipo_medicao "
                        + "WHERE fk_maquina = '%s'",
                Monitoring.getMacAddress());
        return ConfigDB.getJdbc().query(sql, new BeanPropertyRowMapper(TiposMedicao.class));
    }
    
    public static List<Double> getLimits() {
        List<Double> list = new ArrayList();
        List<TiposMedicao> array = getObjectArray();
        for (TiposMedicao tipo : array) {
            list.add(tipo.getMedicaoLimite());
        }
        return list;
    }
    
    public static List<String> getTypes() {
        List<String> list = new ArrayList();
        List<TiposMedicao> array = getObjectArray();
        for (TiposMedicao tipo : array) {
            list.add(tipo.getTipo());
        }
        return list;
        // for (Integer i = 0; i < array.size(); i++) {
        //     System.out.println((String) array.get(i).get(convertKey ));
        // }
    }

}
