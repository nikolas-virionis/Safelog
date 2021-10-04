package com.mycompany.client.java;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import com.mycompany.client.java.entidades.Medicao;

public class InsertDado {

    public static void insert(Medicao medicao) {
        String sql = String.format("INSERT INTO medicao values (NULL, %.2f, '%s', '%s', %d)", medicao.getValor(),
                medicao.getTipo(), medicao.getDataMedicao(), medicao.getFkCategoriaMedicao());
        ConfigDB.getJdbc().execute(sql);
    }

    public static void formatInsert(TiposMedicao tipoMedicao, Double medicao) {
        String sql = String.format(
                "SELECT id_categoria_medicao FROM categoria_medicao "
                        + "JOIN tipo_medicao ON fk_tipo_medicao = id_tipo_medicao "
                        + "WHERE tipo_medicao.tipo = '%s' AND fk_maquina = '%s'",
                tipoMedicao.getTipo(), Monitoring.getMacAddress());
        Integer fkCategoriaMedicao = Integer
                .valueOf(ConfigDB.getJdbc().queryForList(sql).get(0).get("id_categoria_medicao").toString());
        insert(new Medicao(medicao, getTipo(tipoMedicao, medicao), getDatetime(), fkCategoriaMedicao));
    }

    private static String getDatetime() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime now = LocalDateTime.now();
        return dtf.format(now);
    }

    private static String getTipo(TiposMedicao tipoMedicao, Double medicao) {
        // x * 0.6 + 38 => %
        // 0.65x + 28.5 => °C
        // 0.409x + 0.08 => ram livre
        // 0.26x + 21 => disco livre
        // 0.8x + 33.5 => cpu Mhz (%)
        String tipo = tipoMedicao.getTipo();
        Double limite = tipoMedicao.getMedicaoLimite();
        if (tipo.endsWith("temperatura") && medicao >= (limite * 0.65) + 28.5
                || tipo.endsWith("porcentagem") && medicao >= (limite * 0.6) + 38
                || tipo.endsWith("frequencia") && medicao >= (limite * 0.8) + 33.5
                || tipo.equals("disco_livre") && medicao <= (limite * 0.26) + 21
                || tipo.equals("ram_livre") && medicao <= (limite * 0.409) + 0.08) {
            return "critico";
        }
        if (tipo.endsWith("livre") && medicao <= limite || !tipo.endsWith("livre") && medicao >= limite) {
            return "risco";
        }
        return "normal";
    }
}
