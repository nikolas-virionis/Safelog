package com.mycompany.client.java.util;

// import io.github.cdimascio.dotenv.Dotenv;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;

// Essa classe faz as configurações do Banco de Dados

public class ConfigDB {

    private static BasicDataSource getBasicDataSourceAWS() {
        BasicDataSource basicDataSource = new BasicDataSource();
        basicDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        basicDataSource
                .setUrl(String.format("jdbc:mysql://localhost:3306/%s", SensitiveData.DB_NAME));
        basicDataSource.setUsername(SensitiveData.DB_USER);
        basicDataSource.setPassword(SensitiveData.DB_PASSWORD);
        return basicDataSource;
    }

    private static BasicDataSource getBasicDataSourceAzure() {
        BasicDataSource basicDataSource = new BasicDataSource();
        basicDataSource.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        basicDataSource.setUrl(String.format(
                "jdbc:sqlserver://%s:1433;database=%s;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;",
                SensitiveData.DB_AZURE_URL,SensitiveData.DB_NAME));
        basicDataSource.setUsername(SensitiveData.DB_USER);
        basicDataSource.setPassword(SensitiveData.DB_PASSWORD);
        return basicDataSource;
    }

    // retorna jdbc template pronto para realizar query
    public static JdbcTemplate getJdbcAWS() {
        return new JdbcTemplate(getBasicDataSourceAWS());
    }

    public static JdbcTemplate getJdbcAzure() {
        System.out.println("azure");
        return new JdbcTemplate(getBasicDataSourceAzure());
    }
}
