package com.mycompany.projeto.artefato.sprint.entidades;

import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class UsuarioMaquina {

    private Integer idUsuarioMaquina;
    private Character responsavel;
    private Integer fkUsuario;
    private String fkMaquina;

    public UsuarioMaquina(Integer idUsuarioMaquina, Character responsavel,
            Integer fkUsuario, String fkMaquina) {
        this.idUsuarioMaquina = idUsuarioMaquina;
        this.responsavel = responsavel;
        this.fkUsuario = fkUsuario;
        this.fkMaquina = fkMaquina;
    }

    public List<UsuarioMaquina> selectAll(BasicDataSource dataSource) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.query("SELECT * FROM usuario_maquina",
                new BeanPropertyRowMapper(UsuarioMaquina.class));
    }
}
