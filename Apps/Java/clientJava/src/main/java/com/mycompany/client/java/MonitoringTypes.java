package com.mycompany.client.java;

import java.util.List;
import java.util.ArrayList;
import org.springframework.jdbc.core.BeanPropertyRowMapper;

public class MonitoringTypes {

    public static List<TiposMedicao> getObjectArray() {
        String sql = String.format(
                "SELECT tipo_medicao.tipo, medicao_limite, unidade FROM categoria_medicao INNER JOIN "
                        + "tipo_medicao ON fk_tipo_medicao = id_tipo_medicao " + "WHERE fk_maquina = '%s'",
                Monitoring.getMacAddress());
        return ConfigDB.getJdbc().query(sql, new BeanPropertyRowMapper(TiposMedicao.class));
    }

    public static List<Double> getLimits() {
        List<Double> list = new ArrayList<Double>();
        List<TiposMedicao> array = getObjectArray();
        for (TiposMedicao tipo : array) {
            list.add(tipo.getMedicaoLimite());
        }
        return list;
    }

    public static List<String> getTypes() {
        List<String> list = new ArrayList<String>();
        List<TiposMedicao> array = getObjectArray();
        for (TiposMedicao tipo : array) {
            list.add(tipo.getTipo());
        }
        return list;
    }

}
