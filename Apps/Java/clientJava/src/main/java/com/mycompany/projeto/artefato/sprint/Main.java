/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.projeto.artefato.sprint;

/**
 *
 * @author USER
 */
public class Main {
    public static void main(String[] args) {
        Monitoramento m = new Monitoramento();
        System.out.println(m.getMacAddress());  
        System.out.println(m.getBaseBoardSerial());     
        System.out.println(m.getHDSerial());     
        

    }
}
