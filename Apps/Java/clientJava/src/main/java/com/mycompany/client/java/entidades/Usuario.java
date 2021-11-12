package com.mycompany.client.java.entidades;

import java.util.List;
import com.mycompany.client.java.util.ConfigDB;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Usuario {

    private Integer idUsuario;
    private String nome;
    private String email;
    private String senha;
    private String cargo;
    private String foto;
    private String token;
    private String fkEmpresa;
    private Integer fkSupervisor;

    public Integer getIdUsuario() {
        return idUsuario;

    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getFkEmpresa() {
        return fkEmpresa;
    }

    public void setFkEmpresa(String fkEmpresa) {
        this.fkEmpresa = fkEmpresa;
    }

    public Integer getFkSupervisor() {
        return fkSupervisor;
    }

    // public Usuario(Integer idUsuario, String nome, String email, String senha,
    // String cargo, String token, String fkEmpresa, Integer fkSupervisor, String
    // foto) {
    // this.idUsuario = idUsuario;
    // this.nome = nome;
    // this.email = email;
    // this.senha = senha;
    // this.cargo = cargo;
    // this.token = token;
    // this.fkEmpresa = fkEmpresa;
    // this.fkSupervisor = fkSupervisor;
    // this.foto = foto;
    // }
    public void setFkSupervisor(Integer fkSupervisor) {
        this.fkSupervisor = fkSupervisor;
    }

    public Usuario() {
    }

    public static List<Usuario> selectAll() {
        JdbcTemplate jdbcTemplate = ConfigDB.getJdbc();
        return jdbcTemplate.query("SELECT * FROM usuario", new BeanPropertyRowMapper<>(Usuario.class));
    }

    @Override
    public String toString() {
        return "Usuario [cargo=" + cargo + ", email=" + email + ", fkEmpresa=" + fkEmpresa + ", fkSupervisor="
                + fkSupervisor + ", idUsuario=" + idUsuario + ", nome=" + nome + ", senha=" + senha + ", token=" + token
                + "]";
    }
}
