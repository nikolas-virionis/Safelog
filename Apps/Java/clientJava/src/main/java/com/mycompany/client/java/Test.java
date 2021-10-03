package com.mycompany.client.java;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import com.mycompany.client.java.entidades.Usuario;

public class Test {

    public static void main(String[] args) throws InterruptedException{
        // Monitoring m = new Monitoring();
        // System.out.println(m);  

        ConfigDB config = new ConfigDB();
        BasicDataSource dataSource = config.getBasicDataSource();
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);

        String sql = "SELECT * FROM usuario LIMIT 3";
        BeanPropertyRowMapper<Usuario> bean = new BeanPropertyRowMapper<>(Usuario.class);
        List<Usuario> users = jdbcTemplate.query(sql, bean);
        for (Usuario u : users) {
            System.out.println(u);
        }
    }
}
