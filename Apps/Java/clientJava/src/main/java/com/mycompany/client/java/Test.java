package com.mycompany.client.java;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class Test {

    public static void main(String[] args) throws InterruptedException{
        Monitoring m = new Monitoring();
        System.out.println(m);  
        


        ConfigDB config = new ConfigDB();
        BasicDataSource dataSource = config.getBasicDataSource();
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        
    }
}
