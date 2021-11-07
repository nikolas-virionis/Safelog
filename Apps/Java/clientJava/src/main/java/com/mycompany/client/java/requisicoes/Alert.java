package com.mycompany.client.java.requisicoes;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import com.mycompany.client.java.ConfigDB;
import com.mycompany.client.java.TiposMedicao;
import com.mycompany.client.java.entidades.Medicao;

import org.json.JSONObject;

public class Alert {
    private Integer incidentes;
    private Integer fkCategoriaMedicao;
    private static final HttpClient client = HttpClient.newHttpClient();

    public Alert(Integer fkCategoriaMedicao) {
        this.incidentes = 0;
        this.fkCategoriaMedicao = fkCategoriaMedicao;
    }

    public Integer getFkCategoriaMedicao() {
        return this.fkCategoriaMedicao;
    }

    public Integer getIncidentes() {
        return this.incidentes;
    }

    public void incidente(Medicao medicao, TiposMedicao tipoMedicao) {
        this.incidentes++;

        if (this.incidentes >= 4) {
            System.out.println("ALERTA ALERTA PERIGO PERIGO");
            this.incidentes = 0;
            try {
                alerta(medicao, tipoMedicao);
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
    }

    public void normal() {
        this.incidentes = 0;
    }

    private void alerta(Medicao medicao, TiposMedicao tipoMedicao) throws IOException, InterruptedException {
        String sql = String.format(
                "SELECT count(id_chamado) as chamadosAbertos FROM chamado WHERE status_chamado = 'aberto' AND fk_categoria_medicao = %d",
                this.fkCategoriaMedicao);
        Integer chamadosAbertos = Integer
                .valueOf(ConfigDB.getJdbc().queryForList(sql).get(0).get("chamadosAbertos").toString());
        if (chamadosAbertos == 0) {
            abrirChamado(medicao, tipoMedicao);
        }

    }

    private void abrirChamado(Medicao medicao, TiposMedicao tipoMedicao) throws IOException, InterruptedException {
        enviarAlerta(0);
    }

    private void enviarAlerta(int idChamado) {

    }

    @Override
    public String toString() {
        return "Alert [fkCategoriaMedicao=" + fkCategoriaMedicao + ", incidentes=" + incidentes + "]";
    }

}
