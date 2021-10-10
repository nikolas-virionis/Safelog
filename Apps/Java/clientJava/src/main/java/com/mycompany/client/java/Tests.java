package com.mycompany.client.java;

import java.util.concurrent.TimeUnit;

public class Tests {

    public static void main(String[] args) throws InterruptedException {
        Monitoring m = new Monitoring();

        for (int i = 0; i <= 10; i++) {
            System.out.println(m);
            TimeUnit.SECONDS.sleep(1);
        }

        // System.out.println(MonitoringTypes.getTiposMedicao());
        // System.out.println(Usuario.selectAll());
    }
}