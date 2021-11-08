package com.mycompany.client.java.requisicoes;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import com.mycompany.client.java.ConfigDB;
import com.mycompany.client.java.Monitoring;
import com.mycompany.client.java.TiposMedicao;
import com.mycompany.client.java.entidades.Chamado;
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
            System.out.println("ALERTA ALERTA");
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
        JSONObject content = new JSONObject();

        String[] metrica = getTipo(tipoMedicao.getTipo()).split(" - ");

        Chamado novoChamado = new Chamado(
                String.format("Medição %s do componente %s", medicao.getTipo(), metrica[0].toLowerCase()),
                String.format("Uma medição %s de %s do componente %s foi observada", medicao.getTipo(),
                        metrica[1] == "Livre" ? "espaço disponível"
                                : metrica[1] == "Porcentagem" ? "porcentagem de uso" : metrica[1],
                        metrica[0].toLowerCase()),
                String.format("%s", medicao.getTipo() == "critico" ? "emergencia" : "alta"), 's', getResponsavel(),
                tipoMedicao.getFkCategoriaMedicao(), "parcial");

        content.put("titulo", novoChamado.getTitulo());
        content.put("desc", novoChamado.getDescricao());
        content.put("prioridade", novoChamado.getPrioridade());
        content.put("idCategoriaMedicao", novoChamado.getFkCategoriaMedicao());
        content.put("idUsuario", novoChamado.getFkUsuario());
        content.put("automatico", novoChamado.getAutomatico());
        content.put("eficaciaSolucoes", "parcial");
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:3000/chamado/criar"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(content.toString())).build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        // tratar response

        String sql = String.format(
                "SELECT id_chamado FROM chamado WHERE status_chamado = 'aberto' AND fk_categoria_medicao = %d",
                tipoMedicao.getFkCategoriaMedicao());
        Integer idChamado = Integer.valueOf(ConfigDB.getJdbc().queryForList(sql).get(0).get("id_chamado").toString());

        enviarAlerta(idChamado);
        // throw new RuntimeException("tudo corre bem - Usain bolt");
    }

    private void enviarAlerta(int idChamado) {

    }

    private int getResponsavel() {
        String sql = String.format(
                "SELECT id_usuario FROM usuario JOIN usuario_maquina ON id_usuario = fk_usuario AND responsavel = 's' JOIN maquina ON pk_maquina = fk_maquina AND id_maquina = '%s'",
                Monitoring.getMacAddress());
        Integer idUsuario = Integer.valueOf(ConfigDB.getJdbc().queryForList(sql).get(0).get("id_usuario").toString());
        return idUsuario;
    }

    private String getTipo(String tipo) {
        String[] metrica = tipo.split("_");
        return String.format("%s - %s", metrica[0].toUpperCase(),
                metrica[1].substring(0, 1).toUpperCase() + metrica[1].substring(1));
    }

    @Override
    public String toString() {
        return "Alert [fkCategoriaMedicao=" + fkCategoriaMedicao + ", incidentes=" + incidentes + "]";
    }

}
