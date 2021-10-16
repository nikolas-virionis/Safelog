package com.mycompany.client.java;

import java.util.List;
import com.github.britooo.looca.api.group.processos.Processo;
// import java.util.List;
// import java.util.concurrent.TimeUnit;
// import com.github.britooo.looca.api.group.processos.Processo;
import com.github.britooo.looca.api.group.processos.ProcessosGroup;


public class Tests {

    public static void main(String[] args) throws InterruptedException {
        Monitoring m = new Monitoring();

        ProcessosGroup listProc = m.getGrupoDeProcessos();

        List<Processo> procs = listProc.getProcessos();

        for (Processo proc : procs) {
            String str = "%s cpu: %.1f mem: %.1f PID: %d";
            str = String.format(str, proc.getNome(), proc.getUsoCpu(), proc.getUsoMemoria(), proc.getPid());
            System.out.println(str);
            // System.out.println(proc.getNome() + proc.getPid() + "\n");
        }

        // while (true) {
        //     System.out.println(m);
        //     TimeUnit.SECONDS.sleep(1);
        // }

    }
}