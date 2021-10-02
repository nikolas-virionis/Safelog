package com.mycompany.client.java.telas;

import com.mycompany.client.java.ConfigDB;
import com.mycompany.client.java.Monitoring;
import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class Auth {

    public boolean autenticar(String inpEmail, String inpSenha,
            String inpMaquina) {
        Monitoring m = new Monitoring();
        ConfigDB config = new ConfigDB();
        BasicDataSource dataSource = config.getBasicDataSource();
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        List loginsValidos = jdbcTemplate.queryForList(String.format(
                "SELECT * FROM usuario "
                + "JOIN usuario_maquina ON id_usuario = fk_usuario "
                + "JOIN maquina ON fk_maquina = id_maquina "
                + "WHERE usuario.email = '%s' and usuario.senha = MD5('%s') "
                + "AND maquina.senha = MD5('%s') AND id_maquina = '%s'",
                inpEmail, inpSenha, inpMaquina, m.getMacAddress()));
        return loginsValidos.size() > 0;
    }

}
