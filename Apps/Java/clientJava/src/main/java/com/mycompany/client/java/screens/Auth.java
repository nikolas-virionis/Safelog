package com.mycompany.client.java.screens;

import com.mycompany.client.java.Monitoring;
import com.mycompany.client.java.util.ConfigDB;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;

public class Auth {

    public static Integer auth(String email, String senha, String maquina) {
        List<Map<String, Object>> emailValido;
        List<Map<String, Object>> senhaValida;
        List<Map<String, Object>> permissao;
        List<Map<String, Object>> maquinaValida;
        List<Map<String, Object>> senhaMaquinaValida;
        String sqlPermissao = String.format(
                "SELECT * FROM usuario_maquina WHERE fk_maquina = %d AND fk_usuario = (SELECT id_usuario FROM usuario WHERE email = '%s')",
                Monitoring.getPkMaquina(), email);
        try {
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAWS();
            emailValido = jdbcTemplate.queryForList(String.format("SELECT * FROM usuario WHERE email = '%s'", email));
            if (emailValido.size() == 0) {
                return 1;
            }
            senhaValida = jdbcTemplate.queryForList(
                    String.format("SELECT * FROM usuario WHERE email = '%s' AND senha = MD5('%s')", email, senha));
            if (senhaValida.size() == 0) {
                return 2;
            }
            permissao = jdbcTemplate.queryForList(sqlPermissao);
            if (permissao.size() == 0) {
                return 3;
            }
            maquinaValida = jdbcTemplate.queryForList(
                    String.format("SELECT * FROM maquina WHERE id_maquina = '%s'", Monitoring.getMacAddress()));
            if (maquinaValida.size() == 0) {
                return 4;
            }
            senhaMaquinaValida = jdbcTemplate
                    .queryForList(String.format("SELECT * FROM maquina WHERE id_maquina = '%s' AND senha = MD5('%s')",
                            Monitoring.getMacAddress(), maquina));
            if (senhaMaquinaValida.size() == 0) {
                return 5;
            }
        } catch (Exception e) {
            System.out.println("azure");
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAzure();
            emailValido = jdbcTemplate.queryForList(String.format("SELECT * FROM usuario WHERE email = '%s'", email));
            if (emailValido.size() == 0) {
                return 1;
            }
            senhaValida = jdbcTemplate.queryForList(String.format(
                    "SELECT * FROM usuario WHERE email = '%s' AND senha = HASHBYTES('md5', '%s')", email, senha));
            if (senhaValida.size() == 0) {
                return 2;
            }
            permissao = jdbcTemplate.queryForList(sqlPermissao);
            if (permissao.size() == 0) {
                return 3;
            }
            maquinaValida = jdbcTemplate.queryForList(
                    String.format("SELECT * FROM maquina WHERE id_maquina = '%s'", Monitoring.getMacAddress()));
            if (maquinaValida.size() == 0) {
                return 4;
            }
            senhaMaquinaValida = jdbcTemplate.queryForList(
                    String.format("SELECT * FROM maquina WHERE id_maquina = '%s' AND senha = HASHBYTES('md5', '%s')",
                            Monitoring.getMacAddress(), maquina));
            if (senhaMaquinaValida.size() == 0) {
                return 5;
            }
        }
        return 0;
    }
}