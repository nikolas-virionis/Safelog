package com.mycompany.client.java;

import java.util.List;
import java.util.concurrent.TimeUnit;
import com.mycompany.client.java.entidades.Maquina;

import org.springframework.jdbc.core.BeanPropertyRowMapper;

import com.mycompany.client.java.entidades.Empresa;

public class Tests {

    public static void main(String[] args) throws InterruptedException {
        // Monitoring m = new Monitoring();

        // JdbcTemplate template = new ConfigDB.getJdbc();
        String sql = "SELECT * FROM maquina WHERE id_maquina = '73:04:cd:e5:6f:a0'";
        BeanPropertyRowMapper<Maquina> bean = new BeanPropertyRowMapper<>(Maquina.class);

        Maquina machine = ConfigDB.getJdbc().query(sql, bean).get(0);

        System.out.println(machine);

    }
}