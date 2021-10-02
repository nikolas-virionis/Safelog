package com.mycompany.projeto.artefato.sprint;

import io.github.cdimascio.dotenv.Dotenv;
import org.apache.commons.dbcp2.BasicDataSource;

public class ConfigBD {
    private BasicDataSource basicDataSource;
    public ConfigBD(){
        Dotenv dotenv = Dotenv.load();
        basicDataSource = new BasicDataSource();
        basicDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver"
        );
//        exemplo para SQL Server: "com.microsoft.sqlserver.jdbc.SQLServerDriver"
        basicDataSource.setUrl("jdbc:mysql://localhost:3306/" + dotenv.get("DB_NAME")
        );
//        exemplo para SQL Server: "jdbc:sqlserver://meubanco.database.windows.net/meubanco"
        basicDataSource.setUsername(dotenv.get("DB_USER"));
        basicDataSource.setPassword(dotenv.get("DB_PASSWORD"));
        getBasicDataSource();
    }
    public BasicDataSource getBasicDataSource(){
        return basicDataSource;
    }
}
