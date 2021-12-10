package com.mycompany.client.java;

import com.mycompany.client.java.entidades.Medicao;
import com.mycompany.client.java.util.ConfigDB;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Locale;

public class InsertData {

    // insere medições no banco
    public static void insert(Medicao[] medicoes) {
        String str = "INSERT INTO medicao(valor, tipo, data_medicao, fk_categoria_medicao) VALUES ";
        for (Medicao medicao : medicoes) {
            String sql = String.format(Locale.US, "(%.2f, '%s', '%s', %d), \n", medicao.getValor(), medicao.getTipo(),
                    medicao.getDataMedicao(), medicao.getFkCategoriaMedicao());
            str += sql;
        }
        str = str.substring(0, str.length() - 3);
        // System.out.println(str);
        JdbcTemplate jdbcTemplateAWS = ConfigDB.getJdbcAWS();
        JdbcTemplate jdbcTemplateAzure = ConfigDB.getJdbcAzure();
        try {
            jdbcTemplateAWS.execute(str);
        } catch (Exception e) {
            System.out.println("Erro na AWS");
        } finally {
            try {
                jdbcTemplateAzure.execute(str);
            } catch (Exception e) {
                System.out.println("Erro na Azure");
            }
        }

    }

    // formata categoria de medição para insert
    public static Medicao formatInsert(TiposMedicao tipoMedicao, Double medicao, String data) {
        return new Medicao(medicao, getTipo(tipoMedicao, medicao), data, tipoMedicao.getFkCategoriaMedicao());
    }

    // retorna nível de criticidade da medicao
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
