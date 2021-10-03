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
        ConfigDB config = new ConfigDB();
        BasicDataSource dataSource = config.getBasicDataSource();
        return new JdbcTemplate(dataSource);
    }

    private static List<Object> getObjectArray(JdbcTemplate jdbcTemplate) throws DataAccessException {
        String sql = String.format("SELECT tipo_medicao.tipo FROM categoria_medicao INNER JOIN tipo_medicao ON fk_tipo_medicao = id_tipo_medicao WHERE fk_maquina = '%s'", Monitoring.getMacAddress());
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper());
    }

    public static void getTypes() {
        List array = getObjectArray(getJdbcTemplate());
        
        
        // for (Integer i = 0; i < array.size(); i++) {
        //     System.out.println((String) array.get(i).get(convertKey ));
        // }
    }

}
