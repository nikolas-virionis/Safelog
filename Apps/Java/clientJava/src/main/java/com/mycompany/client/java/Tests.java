package com.mycompany.client.java;

import java.util.List;
import com.github.britooo.looca.api.group.processos.Processo;
// import java.util.List;
// import java.util.concurrent.TimeUnit;
// import com.github.britooo.looca.api.group.processos.Processo;
import com.github.britooo.looca.api.group.processos.ProcessosGroup;


public class Tests {

    public static void main(String[] args) throws InterruptedException {
        
        String cmd = "taskkill /F /PID %s";
        cmd = String.format(cmd, "15060");

        try {
            Runtime.getRuntime().exec(cmd);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

    }
}