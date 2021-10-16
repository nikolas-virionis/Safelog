package com.mycompany.client.java;

// import java.util.List;
import java.util.concurrent.TimeUnit;

public class Tests {

    public static void main(String[] args) throws InterruptedException {
        Monitoring m = new Monitoring();

        while (true) {
            System.out.println(m);
            TimeUnit.SECONDS.sleep(1);
        }

    }
}