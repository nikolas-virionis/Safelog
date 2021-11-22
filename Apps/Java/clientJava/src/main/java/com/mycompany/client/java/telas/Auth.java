package com.mycompany.client.java.telas;

import com.mycompany.client.java.Monitoring;
import com.mycompany.client.java.util.ConfigDB;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;

public class Auth {

    public static Boolean autenticar(String email, String senha, String maquina) {
        // jdbcTemplate;
        List<Map<String, Object>> loginsValidos;
        try {
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAWS();
            loginsValidos = jdbcTemplate.queryForList(String.format(
                    "SELECT * FROM usuario " + "JOIN usuario_maquina ON id_usuario = fk_usuario "
                            + "JOIN maquina ON fk_maquina = pk_maquina "
                            + "WHERE usuario.email = '%s' and usuario.senha = MD5('%s') "
                            + "AND maquina.senha = MD5('%s') AND id_maquina = '%s'",
                    email, senha, maquina, Monitoring.getMacAddress()));
        } catch (Exception e) {
            System.out.println("azure");
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAzure();
            loginsValidos = jdbcTemplate.queryForList(String.format(
                    "SELECT * FROM usuario " + "JOIN usuario_maquina ON id_usuario = fk_usuario "
                            + "JOIN maquina ON fk_maquina = pk_maquina "
                            + "WHERE usuario.email = '%s' and usuario.senha = MD5('%s') "
                            + "AND maquina.senha = MD5('%s') AND id_maquina = '%s'",
                    email, senha, maquina, Monitoring.getMacAddress()));
        }
        return loginsValidos.size() > 0;
    }

    public static Boolean authEmail(String email) {
        // JdbcTemplate jdbcTemplate;
        List<Map<String, Object>> emailValido;
        try {
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAWS();
            emailValido = jdbcTemplate.queryForList(String.format("SELECT * FROM usuario WHERE email = '%s'", email));
        } catch (Exception e) {
            System.out.println("azure");
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAzure();
            emailValido = jdbcTemplate.queryForList(String.format("SELECT * FROM usuario WHERE email = '%s'", email));
        }
        return emailValido.size() > 0;
    }

    public static Boolean authSenha(String email, String senha) {
        // jdbcTemplate;
        List<Map<String, Object>> senhaValida;
        try {
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAWS();
            senhaValida = jdbcTemplate.queryForList(
                    String.format("SELECT * FROM usuario WHERE email = '%s' AND senha = MD5('%s')", email, senha));
        } catch (Exception e) {
            System.out.println("azure");
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAzure();
            senhaValida = jdbcTemplate.queryForList(
                    String.format("SELECT * FROM usuario WHERE email = '%s' AND senha = MD5('%s')", email, senha));
        }

        return senhaValida.size() > 0;
    }

    public static Boolean authPermissao(String email) {
        // jdbcTemplate;
        String sql = String.format(
                "SELECT * FROM usuario_maquina WHERE fk_maquina = %d AND fk_usuario = (SELECT id_usuario FROM usuario WHERE email = '%s')",
                Monitoring.getPkMaquina(), email);
        List<Map<String, Object>> permissao;
        try {
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAWS();
            permissao = jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            System.out.println("azure");
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAzure();
            permissao = jdbcTemplate.queryForList(sql);
        }
        return permissao.size() > 0;
    }

    public static Boolean authMaquina() {
        // jdbcTemplate;
        List<Map<String, Object>> maquinaValida;
        try {
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAWS();
            maquinaValida = jdbcTemplate.queryForList(
                    String.format("SELECT * FROM maquina WHERE id_maquina = '%s'", Monitoring.getMacAddress()));
        } catch (Exception e) {
            System.out.println("azure");
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAzure();
            maquinaValida = jdbcTemplate.queryForList(
                    String.format("SELECT * FROM maquina WHERE id_maquina = '%s'", Monitoring.getMacAddress()));
        }
        return maquinaValida.size() > 0;
    }

    public static Boolean authMaquina(String maquina) {
        // jdbcTemplate;
        List<Map<String, Object>> maquinaValida;
        try {
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAWS();
            maquinaValida = jdbcTemplate
                    .queryForList(String.format("SELECT * FROM maquina WHERE id_maquina = '%s' AND senha = MD5('%s')",
                            Monitoring.getMacAddress(), maquina));
        } catch (Exception e) {
            System.out.println("azure");
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAzure();
            maquinaValida = jdbcTemplate
                    .queryForList(String.format("SELECT * FROM maquina WHERE id_maquina = '%s' AND senha = MD5('%s')",
                            Monitoring.getMacAddress(), maquina));
        }
        return maquinaValida.size() > 0;
    }

}
