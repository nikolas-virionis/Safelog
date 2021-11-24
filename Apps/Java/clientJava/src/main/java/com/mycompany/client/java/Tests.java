package com.mycompany.client.java;

// import java.util.List;
// import com.github.britooo.looca.api.group.process8
import com.mycompany.client.java.util.ConfigDB;

public class Tests {

    public static void main(String[] args) throws InterruptedException {

        // String cmd = "taskkill /F /PID %s";
        // cmd = String.format(cmd, "15060");

        // try {
        // Runtime.getRuntime().exec(cmd);
        // } catch (Exception e) {
        // System.out.println(e.getMessage());
        // }
        System.out.println(ConfigDB.getJdbcAWS().queryForList("select * from usuario"));

    }
}