package com.mycompany.client.java;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import com.mycompany.client.java.entidades.Usuario;

public class Test {

    public static void main(String[] args) throws InterruptedException {
         Monitoring m = new Monitoring();
         System.out.println(m);  

//        System.out.println(MonitoringTypes.getObjectArray());
//        System.out.println(Usuario.selectAll());
    }
}
