/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.projeto.artefato.sprint;

import io.github.cdimascio.dotenv.Dotenv;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import com.mycompany.projeto.artefato.sprint.entidades.*;
import java.util.List;
import org.springframework.jdbc.core.BeanPropertyRowMapper;

/**
 *
 * @author USER
 */
public class Main {

    public static void main(String[] args) {
        Monitoramento m = new Monitoramento();
        System.out.println(m.getMacAddress());
        System.out.println(m.getBaseBoardSerial());
        System.out.println(m.getHDSerial());

        ConfigBD config = new ConfigBD();
        BasicDataSource dataSource = config.getBasicDataSource();
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        
    }
}
