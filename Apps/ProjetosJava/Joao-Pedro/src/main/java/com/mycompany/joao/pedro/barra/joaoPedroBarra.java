/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.joao.pedro.barra;

import java.util.concurrent.ThreadLocalRandom;

/**
 *
 * @author joaopedrooliveira
 */
public class joaoPedroBarra extends javax.swing.JFrame {

    Integer valorCPU = 0;
    Integer valorDisco = 0;
    Integer valorMemoria = 0;

    Integer minCPU = 100;
    Integer maxCPU = 0;

    Integer minDisco = 100;
    Integer maxDisco = 0;

    Integer minMemoria = 100;
    Integer maxMemoria = 0;

    Integer mediaCPU = 0;
    Integer mediaDisco = 0;
    Integer mediaMemoria = 0;

    Integer qntCliques = 0;

    String porcen = "%";

    public joaoPedroBarra() {
        initComponents();
    }

    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        barraDaCPU = new javax.swing.JProgressBar();
        barraMemoria = new javax.swing.JProgressBar();
        btnLerDados = new javax.swing.JButton();
        barraDisco = new javax.swing.JProgressBar();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        minimoCPU = new javax.swing.JLabel();
        jLabel7 = new javax.swing.JLabel();
        jLabel8 = new javax.swing.JLabel();
        jLabel9 = new javax.swing.JLabel();
        jLabel10 = new javax.swing.JLabel();
        jLabel11 = new javax.swing.JLabel();
        jLabel12 = new javax.swing.JLabel();
        jLabel13 = new javax.swing.JLabel();
        showMaxCPU = new javax.swing.JLabel();
        showMinCPU = new javax.swing.JLabel();
        showMediaCPU = new javax.swing.JLabel();
        showMaxMemoria = new javax.swing.JLabel();
        showMinMemoria = new javax.swing.JLabel();
        showMediaMemoria = new javax.swing.JLabel();
        showMaxDisco = new javax.swing.JLabel();
        showMinDisco = new javax.swing.JLabel();
        showMediaDisco = new javax.swing.JLabel();

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 100, Short.MAX_VALUE)
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 100, Short.MAX_VALUE)
        );

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setSize(new java.awt.Dimension(10, 1090));

        barraDaCPU.setToolTipText("");
        barraDaCPU.setValue(0);
        barraDaCPU.setSize(new java.awt.Dimension(10, 1));
        barraDaCPU.setStringPainted(true);

        barraMemoria.setStringPainted(true);

        btnLerDados.setText("Ler os Dados");
        btnLerDados.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnLerDadosActionPerformed(evt);
            }
        });

        barraDisco.setStringPainted(true);

        jLabel2.setFont(new java.awt.Font("Arial", 1, 18)); // NOI18N
        jLabel2.setText("CPU");

        jLabel3.setFont(new java.awt.Font("Arial", 1, 18)); // NOI18N
        jLabel3.setText("Memória");

        jLabel4.setFont(new java.awt.Font("Arial", 1, 18)); // NOI18N
        jLabel4.setText("Disco");

        jLabel5.setText("Máximo:");

        minimoCPU.setText("Mínimo:");

        jLabel7.setText("Média:");

        jLabel8.setText("Máximo:");

        jLabel9.setText("Mínimo:");

        jLabel10.setText("Média:");

        jLabel11.setText("Máximo:");

        jLabel12.setText("Mínimo:");

        jLabel13.setText("Média:");

        showMaxCPU.setText("0");

        showMinCPU.setText("0");

        showMediaCPU.setText("0");

        showMaxMemoria.setText("0");

        showMinMemoria.setText("0");

        showMediaMemoria.setText("0");

        showMaxDisco.setText("0");

        showMinDisco.setText("0");

        showMediaDisco.setText("0");

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addGroup(layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(layout.createSequentialGroup()
                                .addGap(56, 56, 56)
                                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(barraDaCPU, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addGroup(layout.createSequentialGroup()
                                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(minimoCPU)
                                            .addComponent(jLabel7)
                                            .addComponent(jLabel5))
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(showMaxCPU)
                                            .addComponent(showMinCPU)
                                            .addComponent(showMediaCPU))))
                                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(layout.createSequentialGroup()
                                        .addGap(137, 137, 137)
                                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(barraMemoria, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                            .addGroup(layout.createSequentialGroup()
                                                .addGap(6, 6, 6)
                                                .addComponent(jLabel10)
                                                .addGap(18, 18, 18)
                                                .addComponent(showMediaMemoria, javax.swing.GroupLayout.PREFERRED_SIZE, 99, javax.swing.GroupLayout.PREFERRED_SIZE))))
                                    .addGroup(layout.createSequentialGroup()
                                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addGroup(layout.createSequentialGroup()
                                                .addGap(137, 137, 137)
                                                .addComponent(jLabel8))
                                            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                .addComponent(jLabel9)))
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(showMaxMemoria, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                            .addGroup(layout.createSequentialGroup()
                                                .addComponent(showMinMemoria, javax.swing.GroupLayout.PREFERRED_SIZE, 52, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addGap(0, 0, Short.MAX_VALUE))))))
                            .addGroup(layout.createSequentialGroup()
                                .addGap(344, 344, 344)
                                .addComponent(btnLerDados, javax.swing.GroupLayout.PREFERRED_SIZE, 180, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(98, 98, 98))
                    .addGroup(layout.createSequentialGroup()
                        .addGap(115, 115, 115)
                        .addComponent(jLabel2)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jLabel3)
                        .addGap(161, 161, 161)))
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 46, Short.MAX_VALUE)
                        .addComponent(jLabel4)
                        .addGap(227, 227, 227))
                    .addGroup(layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(barraDisco, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(layout.createSequentialGroup()
                                .addComponent(jLabel13)
                                .addGap(18, 18, 18)
                                .addComponent(showMediaDisco, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                            .addGroup(layout.createSequentialGroup()
                                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel12)
                                    .addComponent(jLabel11))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addComponent(showMaxDisco, javax.swing.GroupLayout.DEFAULT_SIZE, 115, Short.MAX_VALUE)
                                    .addComponent(showMinDisco, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))))
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGap(74, 74, 74)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel2)
                    .addComponent(jLabel3)
                    .addComponent(jLabel4))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(barraMemoria, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(barraDaCPU, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(barraDisco, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(layout.createSequentialGroup()
                                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                    .addComponent(jLabel5)
                                    .addComponent(showMaxCPU))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                    .addComponent(minimoCPU)
                                    .addComponent(showMinCPU))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                    .addComponent(jLabel7)
                                    .addComponent(showMediaCPU)))
                            .addGroup(layout.createSequentialGroup()
                                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                    .addComponent(jLabel8)
                                    .addComponent(showMaxMemoria, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                    .addComponent(jLabel9)
                                    .addComponent(showMinMemoria, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                    .addComponent(jLabel10)
                                    .addComponent(showMediaMemoria, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE))))
                        .addGap(100, 100, 100)
                        .addComponent(btnLerDados, javax.swing.GroupLayout.PREFERRED_SIZE, 46, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel11)
                            .addComponent(showMaxDisco, javax.swing.GroupLayout.PREFERRED_SIZE, 16, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel12)
                            .addComponent(showMinDisco, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel13)
                            .addComponent(showMediaDisco, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE)))))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnLerDadosActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnLerDadosActionPerformed

        valorCPU = ThreadLocalRandom.current().nextInt(1, 101);
        valorDisco = ThreadLocalRandom.current().nextInt(1, 101);
        valorMemoria = ThreadLocalRandom.current().nextInt(1, 101);
        
        barraDaCPU.setValue(valorCPU);
        barraMemoria.setValue(valorMemoria);
        barraDisco.setValue(valorDisco);

        qntCliques++;

        //____________CALCULO CPU_____________________________
        if (valorCPU < minCPU) {

            minCPU = valorCPU;
        }

        if (valorCPU > maxCPU) {

            maxCPU = valorCPU;
        }

        mediaCPU += valorCPU;
        mediaCPU = mediaCPU / qntCliques;
        showMinCPU.setText(minCPU.toString() + porcen);
        showMaxCPU.setText(maxCPU.toString() + porcen);
        showMediaCPU.setText(mediaCPU.toString() + porcen);
        

        //____________CALCULO DISCO_____________________________
        if (valorDisco < minDisco) {

            minDisco = valorDisco;
        }

        if (valorDisco > maxDisco) {

            maxDisco = valorDisco;
        }

        mediaDisco += valorDisco;
        mediaDisco = mediaDisco / qntCliques;
        showMinDisco.setText(minDisco.toString() + porcen);
        showMaxDisco.setText(maxDisco.toString() + porcen);
        showMediaDisco.setText(mediaDisco.toString() + porcen);
        

        //____________CALCULO MEMORIA_____________________________
        if (valorMemoria < minMemoria) {

            minMemoria = valorMemoria;
        }

        if (valorMemoria > maxMemoria) {

            maxMemoria = valorMemoria;
        }

        mediaMemoria += valorMemoria;
        mediaMemoria = mediaMemoria / qntCliques;
        showMinMemoria.setText(minMemoria.toString() + porcen);
        showMaxMemoria.setText(maxMemoria.toString() + porcen);
        showMediaMemoria.setText(mediaMemoria.toString() + porcen);
        
        
    }//GEN-LAST:event_btnLerDadosActionPerformed

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(joaoPedroBarra.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(joaoPedroBarra.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(joaoPedroBarra.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(joaoPedroBarra.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new joaoPedroBarra().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JProgressBar barraDaCPU;
    private javax.swing.JProgressBar barraDisco;
    private javax.swing.JProgressBar barraMemoria;
    private javax.swing.JButton btnLerDados;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel12;
    private javax.swing.JLabel jLabel13;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JLabel minimoCPU;
    private javax.swing.JLabel showMaxCPU;
    private javax.swing.JLabel showMaxDisco;
    private javax.swing.JLabel showMaxMemoria;
    private javax.swing.JLabel showMediaCPU;
    private javax.swing.JLabel showMediaDisco;
    private javax.swing.JLabel showMediaMemoria;
    private javax.swing.JLabel showMinCPU;
    private javax.swing.JLabel showMinDisco;
    private javax.swing.JLabel showMinMemoria;
    // End of variables declaration//GEN-END:variables
}
