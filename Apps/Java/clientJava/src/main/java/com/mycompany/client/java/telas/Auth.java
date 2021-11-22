package com.mycompany.client.java.telas;

import com.mycompany.client.java.Monitoring;
import com.mycompany.client.java.util.ConfigDB;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;

public class Auth {

    public static Boolean autenticar(String email, String senha, String maquina) {
        JdbcTemplate jdbcTemplate;
        try {
            jdbcTemplate = ConfigDB.getJdbcAWS();
        } catch (Exception e) {
            System.out.println("azure");
            jdbcTemplate = ConfigDB.getJdbcAzure();
        }
        List<Map<String, Object>> loginsValidos = jdbcTemplate.queryForList(String.format(
                "SELECT * FROM usuario " + "JOIN usuario_maquina ON id_usuario = fk_usuario "
                        + "JOIN maquina ON fk_maquina = pk_maquina "
                        + "WHERE usuario.email = '%s' and usuario.senha = MD5('%s') "
                        + "AND maquina.senha = MD5('%s') AND id_maquina = '%s'",
                email, senha, maquina, Monitoring.getMacAddress()));
        return loginsValidos.size() > 0;
    }

    public static Boolean authEmail(String email) {
        JdbcTemplate jdbcTemplate;
        try {
            jdbcTemplate = ConfigDB.getJdbcAWS();
        } catch (Exception e) {
            System.out.println("azure");
            jdbcTemplate = ConfigDB.getJdbcAzure();
        }
        List<Map<String, Object>> emailValido = jdbcTemplate
                .queryForList(String.format("SELECT * FROM usuario WHERE email = '%s'", email));
        return emailValido.size() > 0;
    }

    public static Boolean authSenha(String email, String senha) {
        JdbcTemplate jdbcTemplate;
        try {
            jdbcTemplate = ConfigDB.getJdbcAWS();
        } catch (Exception e) {
            System.out.println("azure");
            jdbcTemplate = ConfigDB.getJdbcAzure();
        }
        List<Map<String, Object>> senhaValida = jdbcTemplate.queryForList(
                String.format("SELECT * FROM usuario WHERE email = '%s' AND senha = MD5('%s')", email, senha));
        return senhaValida.size() > 0;
    }

    public static Boolean authPermissao(String email) {
        JdbcTemplate jdbcTemplate;
        try {
            jdbcTemplate = ConfigDB.getJdbcAWS();
        } catch (Exception e) {
            System.out.println("azure");
            jdbcTemplate = ConfigDB.getJdbcAzure();
        }
        String sql = String.format(
                "SELECT * FROM usuario_maquina WHERE fk_maquina = %d AND fk_usuario = (SELECT id_usuario FROM usuario WHERE email = '%s')",
                Monitoring.getPkMaquina(), email);
        List<Map<String, Object>> permissao = jdbcTemplate.queryForList(sql);
        return permissao.size() > 0;
    }

    public static Boolean authMaquina() {
        JdbcTemplate jdbcTemplate;
        try {
            jdbcTemplate = ConfigDB.getJdbcAWS();
        } catch (Exception e) {
            System.out.println("azure");
            jdbcTemplate = ConfigDB.getJdbcAzure();
        }
        List<Map<String, Object>> maquinaValida = jdbcTemplate.queryForList(
                String.format("SELECT * FROM maquina WHERE id_maquina = '%s'", Monitoring.getMacAddress()));
        return maquinaValida.size() > 0;
    }

    public static Boolean authMaquina(String maquina) {
        JdbcTemplate jdbcTemplate;
        try {
            jdbcTemplate = ConfigDB.getJdbcAWS();
        } catch (Exception e) {
            System.out.println("azure");
            jdbcTemplate = ConfigDB.getJdbcAzure();
        }
        List<Map<String, Object>> maquinaValida = jdbcTemplate
                .queryForList(String.format("SELECT * FROM maquina WHERE id_maquina = '%s' AND senha = MD5('%s')",
                        Monitoring.getMacAddress(), maquina));
        return maquinaValida.size() > 0;
    }

}
