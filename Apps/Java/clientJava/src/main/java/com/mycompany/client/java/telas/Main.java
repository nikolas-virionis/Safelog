package com.mycompany.client.java.telas;

import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.UIManager;
import javax.swing.UnsupportedLookAndFeelException;
import com.mycompany.client.java.*;

public class Main extends javax.swing.JFrame {

    private String email;
    private static Boolean continuarMonitoramento = true;
    Thread thread;

    private Integer MaxCpu = 0;
    private Integer MinCpu = 101;
    private Integer MaxMem = 0;
    private Integer MinMem = 101;
    private Integer MaxDisk = 0;
    private Integer MinDisk = 101;

    private Integer contagem = 0;
    private Integer somaC = 0;
    private Integer somaD = 0;
    private Integer somaM = 0;

    /**
     * Creates new form TelaPrincipal
     */

    public Main() {
        this.setLocationRelativeTo(null);
        this.setResizable(false);
        try {
            UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName());

        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
        } catch (UnsupportedLookAndFeelException ex) {
            Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
        }
        initComponents();
        thread = new Thread(() -> {
            insertBanco();
        });
        thread.start();
    }

    private void insertBanco() {
        do {
            String data = Monitoring.getDatetime();
            for (TiposMedicao tipo : MonitoringTypes.getTiposMedicao()) {
                Double medicao;
                Monitoring m = new Monitoring();
                if (tipo.getTipo().equals("cpu_porcentagem")) {
                    medicao = m.getUsoCPU();
                    System.out.println("cpu uso: ");
                    System.out.println(medicao);
                    brCpu.setValue(medicao.intValue());
                } else if (tipo.getTipo().equals("cpu_frequencia")) {
                    medicao = m.getClockCPU();
                    System.out.println("cpu freq");
                    brCpuClock.setValue(medicao.intValue());
                } else if (tipo.getTipo().equals("cpu_temperatura")) {
                    medicao = m.getTemp();
                    System.out.println("cpu temperatura: ");
                    System.out.println(medicao);
                    lblTemp.setText(medicao.toString());
                } else if (tipo.getTipo().equals("ram_porcentagem")) {
                    medicao = m.getUsoRAM();
                    System.out.println("ram uso");
                    System.out.println(medicao);
                    brMem.setValue(medicao.intValue());
                } else if (tipo.getTipo().equals("ram_livre")) {
                    medicao = m.getFreeRAMGb();
                    System.out.println("ram livre: ");
                    System.out.println(medicao);
                    lblMemFree.setText(medicao.toString());
                } else if (tipo.getTipo().equals("disco_livre")) {
                    medicao = m.getFreeDiscoGb();
                    System.out.println("disco livre: ");
                    System.out.println(medicao);
                    lblDiskFree.setText(medicao.toString());
                } else if (tipo.getTipo().equals("disco_porcentagem")) {
                    medicao = m.getUsoDisco();
                    System.out.println("disco uso: ");
                    System.out.println(medicao);
                    brDisk.setValue(medicao.intValue());
                } else {
                    throw new RuntimeException("Erro no tipo de medicao na classe TiposMedicao");
                }
                InsertDado.formatInsert(tipo, medicao, data);
            }

            try {
                TimeUnit.SECONDS.sleep(30);
            } catch (InterruptedException e) {
                e.printStackTrace();
                throw new RuntimeException("Erro no time sleep");
            }
        } while (getContinuarMonitoramento());
    }

    public static Boolean getContinuarMonitoramento() {
        return continuarMonitoramento;
    }

    public static void setContinuarMonitoramento(Boolean continuarMonitoramentos) {
        continuarMonitoramento = continuarMonitoramentos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Main(String email) {
        this();

        this.setEmail(email);
        // System.out.println(email);
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated
    // <editor-fold defaultstate="collapsed" desc="Generated
    // Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        brCpu = new javax.swing.JProgressBar();
        brDisk = new javax.swing.JProgressBar();
        brMem = new javax.swing.JProgressBar();
        jPanel2 = new javax.swing.JPanel();
        jLabel5 = new javax.swing.JLabel();
        jLabel6 = new javax.swing.JLabel();
        jLabel7 = new javax.swing.JLabel();
        jLabel8 = new javax.swing.JLabel();
        jLabel9 = new javax.swing.JLabel();
        jLabel10 = new javax.swing.JLabel();
        jLabel11 = new javax.swing.JLabel();
        jLabel12 = new javax.swing.JLabel();
        jLabel13 = new javax.swing.JLabel();
        jLabel14 = new javax.swing.JLabel();
        jLabel15 = new javax.swing.JLabel();
        jLabel16 = new javax.swing.JLabel();
        jLabel17 = new javax.swing.JLabel();
        cpuMax = new javax.swing.JLabel();
        cpuMed = new javax.swing.JLabel();
        cpuMin = new javax.swing.JLabel();
        memMax = new javax.swing.JLabel();
        memMin = new javax.swing.JLabel();
        memMed = new javax.swing.JLabel();
        diskMax = new javax.swing.JLabel();
        diskMed = new javax.swing.JLabel();
        diskMin = new javax.swing.JLabel();
        jLabel18 = new javax.swing.JLabel();
        jButton1 = new javax.swing.JButton();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        brCpuClock = new javax.swing.JProgressBar();
        jLabel19 = new javax.swing.JLabel();
        jLabel20 = new javax.swing.JLabel();
        jLabel21 = new javax.swing.JLabel();
        lblTemp = new javax.swing.JLabel();
        jLabel23 = new javax.swing.JLabel();
        jLabel24 = new javax.swing.JLabel();
        jLabel25 = new javax.swing.JLabel();
        jLabel26 = new javax.swing.JLabel();
        jLabel27 = new javax.swing.JLabel();
        lblDiskFree = new javax.swing.JLabel();
        lblMemFree = new javax.swing.JLabel();
        jLabel22 = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        jPanel1.setBackground(new java.awt.Color(5, 0, 255));

        jLabel1.setFont(new java.awt.Font("Segoe UI Black", 1, 36)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(255, 255, 255));
        jLabel1.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);

        brCpu.setStringPainted(true);

        brDisk.setStringPainted(true);

        brMem.setStringPainted(true);

        jPanel2.setBackground(new java.awt.Color(0, 51, 153));
        jPanel2.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        jPanel2.setForeground(new java.awt.Color(0, 102, 255));

        jLabel5.setFont(new java.awt.Font("Segoe UI", 1, 24)); // NOI18N
        jLabel5.setForeground(new java.awt.Color(255, 255, 255));
        jLabel5.setText("Relatório ");

        jLabel6.setForeground(new java.awt.Color(255, 255, 255));
        jLabel6.setText("Máxima:");

        jLabel7.setForeground(new java.awt.Color(255, 255, 255));
        jLabel7.setText("Minímo:");

        jLabel8.setForeground(new java.awt.Color(255, 255, 255));
        jLabel8.setText("Média:");

        jLabel9.setForeground(new java.awt.Color(255, 255, 255));
        jLabel9.setText("Máxima:");

        jLabel10.setForeground(new java.awt.Color(255, 255, 255));
        jLabel10.setText("Minímo:");

        jLabel11.setForeground(new java.awt.Color(255, 255, 255));
        jLabel11.setText("Média:");

        jLabel12.setForeground(new java.awt.Color(255, 255, 255));
        jLabel12.setText("Máxima:");

        jLabel13.setForeground(new java.awt.Color(255, 255, 255));
        jLabel13.setText("Minímo:");

        jLabel14.setForeground(new java.awt.Color(255, 255, 255));
        jLabel14.setText("Média:");

        jLabel15.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        jLabel15.setForeground(new java.awt.Color(255, 255, 255));
        jLabel15.setText("CPU");

        jLabel16.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        jLabel16.setForeground(new java.awt.Color(255, 255, 255));
        jLabel16.setText("Memória");

        jLabel17.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        jLabel17.setForeground(new java.awt.Color(255, 255, 255));
        jLabel17.setText("Disco");

        cpuMax.setFont(new java.awt.Font("Dialog", 0, 14)); // NOI18N
        cpuMax.setForeground(new java.awt.Color(255, 255, 255));
        cpuMax.setText("0");

        cpuMed.setFont(new java.awt.Font("Dialog", 0, 14)); // NOI18N
        cpuMed.setForeground(new java.awt.Color(255, 255, 255));
        cpuMed.setText("0");

        cpuMin.setFont(new java.awt.Font("Dialog", 0, 14)); // NOI18N
        cpuMin.setForeground(new java.awt.Color(255, 255, 255));
        cpuMin.setText("0");

        memMax.setFont(new java.awt.Font("Dialog", 0, 14)); // NOI18N
        memMax.setForeground(new java.awt.Color(255, 255, 255));
        memMax.setText("0");

        memMin.setFont(new java.awt.Font("Dialog", 0, 14)); // NOI18N
        memMin.setForeground(new java.awt.Color(255, 255, 255));
        memMin.setText("0");

        memMed.setFont(new java.awt.Font("Dialog", 0, 14)); // NOI18N
        memMed.setForeground(new java.awt.Color(255, 255, 255));
        memMed.setText("0");

        diskMax.setFont(new java.awt.Font("Dialog", 0, 14)); // NOI18N
        diskMax.setForeground(new java.awt.Color(255, 255, 255));
        diskMax.setText("0");

        diskMed.setFont(new java.awt.Font("Dialog", 0, 14)); // NOI18N
        diskMed.setForeground(new java.awt.Color(255, 255, 255));
        diskMed.setText("0");

        diskMin.setFont(new java.awt.Font("Dialog", 0, 14)); // NOI18N
        diskMin.setForeground(new java.awt.Color(255, 255, 255));
        diskMin.setText("0");

        jButton1.setBackground(new java.awt.Color(0, 0, 153));
        jButton1.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        jButton1.setForeground(new java.awt.Color(255, 255, 255));
        jButton1.setText("Sair");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout
                .setHorizontalGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                        .addGroup(jPanel2Layout.createSequentialGroup().addGap(26, 26, 26)
                                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                        .addComponent(jLabel14).addComponent(jLabel13).addComponent(jLabel12)
                                        .addComponent(jLabel11).addComponent(
                                                jLabel10)
                                        .addComponent(jLabel9).addComponent(jLabel8).addComponent(jLabel7)
                                        .addComponent(jLabel6))
                                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                        .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                                .addContainerGap(82, Short.MAX_VALUE)
                                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                        .addGroup(javax.swing.GroupLayout.Alignment.TRAILING,
                                                jPanel2Layout.createSequentialGroup().addComponent(jLabel5).addGap(66,
                                                        66, 66))
                                        .addGroup(javax.swing.GroupLayout.Alignment.TRAILING,
                                                jPanel2Layout.createSequentialGroup().addGroup(jPanel2Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                                        .addComponent(
                                                                cpuMax, javax.swing.GroupLayout.PREFERRED_SIZE, 48,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addGroup(jPanel2Layout
                                                                .createParallelGroup(
                                                                        javax.swing.GroupLayout.Alignment.TRAILING)
                                                                .addComponent(jLabel16,
                                                                        javax.swing.GroupLayout.PREFERRED_SIZE, 61,
                                                                        javax.swing.GroupLayout.PREFERRED_SIZE)
                                                                .addComponent(jLabel15,
                                                                        javax.swing.GroupLayout.PREFERRED_SIZE, 41,
                                                                        javax.swing.GroupLayout.PREFERRED_SIZE))
                                                        .addComponent(cpuMed, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                48, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(cpuMin, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                48, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(memMax, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                48, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(memMin, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                48, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(memMed, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                48, javax.swing.GroupLayout.PREFERRED_SIZE))
                                                        .addGap(100, 100, 100))
                                        .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout
                                                .createSequentialGroup()
                                                .addGroup(jPanel2Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                                        .addComponent(diskMax, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                48, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(jLabel17, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                41, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(diskMin, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                48, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(diskMed, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                48, javax.swing.GroupLayout.PREFERRED_SIZE))
                                                .addGap(41, 41, 41)
                                                .addGroup(jPanel2Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                                        .addComponent(jLabel18, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                48, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                71, javax.swing.GroupLayout.PREFERRED_SIZE))))));
        jPanel2Layout.setVerticalGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                .addGroup(jPanel2Layout.createSequentialGroup().addContainerGap().addComponent(jLabel5))
                                .addGroup(jPanel2Layout.createSequentialGroup().addGap(0, 0, Short.MAX_VALUE)
                                        .addComponent(jLabel18)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)))
                        .addGroup(
                                jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                        .addGroup(jPanel2Layout.createSequentialGroup().addComponent(jLabel15)
                                                .addGap(10, 10, 10)
                                                .addGroup(jPanel2Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(jLabel6).addComponent(cpuMax))
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                .addGroup(jPanel2Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(jLabel7).addComponent(cpuMin))
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                .addGroup(jPanel2Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(jLabel8).addComponent(cpuMed))
                                                .addGap(20, 20, 20).addComponent(jLabel16).addGap(5, 5, 5)
                                                .addGroup(jPanel2Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(jLabel9).addComponent(memMax))
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                .addGroup(jPanel2Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(jLabel10).addComponent(memMin))
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                .addGroup(jPanel2Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(jLabel11).addComponent(memMed))
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 20,
                                                        Short.MAX_VALUE)
                                                .addComponent(jLabel17).addGap(14, 14, 14)
                                                .addGroup(jPanel2Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(jLabel12).addComponent(diskMax))
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                .addGroup(jPanel2Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(jLabel13).addComponent(diskMin))
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                .addGroup(jPanel2Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(jLabel14).addComponent(diskMed))
                                                .addContainerGap())
                                        .addComponent(jButton1, javax.swing.GroupLayout.Alignment.TRAILING))));

        jLabel2.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("CPU");

        jLabel3.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(255, 255, 255));
        jLabel3.setText("Memória");

        jLabel4.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(255, 255, 255));
        jLabel4.setText("Disco");

        brCpuClock.setStringPainted(true);

        jLabel19.setText("Uso:");

        jLabel20.setText("Frequencia:");

        jLabel21.setText("Temperatura:");

        lblTemp.setText("jLabel22");

        jLabel23.setFont(new java.awt.Font("Segoe UI", 0, 10)); // NOI18N
        jLabel23.setText("(% em relação ao máximo)");

        jLabel24.setText("Uso:");

        jLabel25.setText("Uso:");

        jLabel26.setText("Disponível: ");

        jLabel27.setText("Disponível: ");

        lblDiskFree.setText("jLabel28");

        lblMemFree.setText("jLabel28");

        jLabel22.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel22.setIcon(new javax.swing.ImageIcon(
                "C:\\Users\\Cruz\\Desktop\\Rep-Grupo06\\1CCO-2021-2-Grupo-06\\1CCO-2021-2-Grupo-06\\site-estatico\\public\\assets\\img\\logo\\logo-escrita-branco.png")); // NOI18N

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(jPanel1Layout.createSequentialGroup().addGroup(jPanel1Layout
                        .createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                        .addGroup(jPanel1Layout.createSequentialGroup().addContainerGap().addGroup(jPanel1Layout
                                .createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 61,
                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED,
                                                javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                        .addComponent(brMem, javax.swing.GroupLayout.PREFERRED_SIZE, 339,
                                                javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addGroup(jPanel1Layout.createSequentialGroup().addGap(0, 4, Short.MAX_VALUE)
                                        .addGroup(jPanel1Layout
                                                .createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                                .addGroup(jPanel1Layout.createSequentialGroup()
                                                        .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                339, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addGap(23, 23, 23))
                                                .addGroup(jPanel1Layout.createSequentialGroup()
                                                        .addComponent(jLabel2, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                41, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addGap(17, 17, 17)
                                                        .addComponent(jLabel19, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                43, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addGap(29, 29, 29).addComponent(brCpu,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE, 339,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE))))
                                .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 41,
                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED,
                                                javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                        .addGroup(jPanel1Layout
                                                .createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                                .addGroup(jPanel1Layout.createSequentialGroup()
                                                        .addComponent(jLabel21, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                76, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addGap(145, 145, 145).addComponent(lblTemp))
                                                .addGroup(jPanel1Layout.createSequentialGroup()
                                                        .addComponent(jLabel20, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                65, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addPreferredGap(
                                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                        .addComponent(brCpuClock,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE, 339,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE))
                                                .addComponent(jLabel24, javax.swing.GroupLayout.PREFERRED_SIZE, 43,
                                                        javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addGroup(jPanel1Layout.createSequentialGroup().addComponent(jLabel25)
                                                        .addPreferredGap(
                                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                                        .addComponent(brDisk, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                339, javax.swing.GroupLayout.PREFERRED_SIZE))
                                                .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout
                                                        .createSequentialGroup().addComponent(jLabel27)
                                                        .addPreferredGap(
                                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                                        .addComponent(lblDiskFree).addGap(147, 147, 147))
                                                .addGroup(jPanel1Layout.createSequentialGroup().addComponent(jLabel26)
                                                        .addPreferredGap(
                                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                                        .addComponent(lblMemFree).addGap(149, 149, 149)))))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED,
                                        javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                        .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                        .addGroup(jPanel1Layout.createSequentialGroup().addGap(35, 35, 35)
                                                .addComponent(jLabel23))
                                        .addGroup(jPanel1Layout.createSequentialGroup().addGap(26, 26, 26).addComponent(
                                                jLabel22, javax.swing.GroupLayout.PREFERRED_SIZE, 406,
                                                javax.swing.GroupLayout.PREFERRED_SIZE)))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED,
                                        javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
                        .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE,
                                javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)));
        jPanel1Layout.setVerticalGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(jPanel1Layout.createSequentialGroup().addGap(14, 14, 14).addComponent(jLabel1)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 15, Short.MAX_VALUE)
                        .addGroup(
                                jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                        .addGroup(jPanel1Layout.createSequentialGroup().addComponent(jLabel22)
                                                .addGap(33, 33, 33)
                                                .addGroup(jPanel1Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(jLabel2)
                                                        .addComponent(brCpu, javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                                        .addComponent(jLabel19))
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                                .addGroup(jPanel1Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(brCpuClock, javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                                        .addComponent(jLabel20))
                                                .addGap(2, 2, 2)
                                                .addComponent(jLabel23, javax.swing.GroupLayout.PREFERRED_SIZE, 16,
                                                        javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                .addGroup(jPanel1Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                                        .addComponent(lblTemp).addComponent(jLabel21))
                                                .addGap(18, 18, 18)
                                                .addGroup(jPanel1Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(brMem, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(jLabel24).addComponent(jLabel3))
                                                .addGap(18, 18, 18)
                                                .addGroup(jPanel1Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(jLabel26).addComponent(lblMemFree))
                                                .addGap(23, 23, 23)
                                                .addGroup(jPanel1Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(brDisk, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(jLabel25).addComponent(jLabel4))
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                                .addGroup(jPanel1Layout
                                                        .createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(lblDiskFree).addComponent(jLabel27))
                                                .addGap(46, 46, 46))
                                        .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE,
                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)));

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING).addComponent(
                jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE));
        layout.setVerticalGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING).addComponent(
                jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE,
                javax.swing.GroupLayout.PREFERRED_SIZE));

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnPrincipalActionPerformed(java.awt.event.ActionEvent evt) {// GEN-FIRST:event_btnPrincipalActionPerformed
        Integer valorCpu = ThreadLocalRandom.current().nextInt(1, 101);
        Integer valorDisk = ThreadLocalRandom.current().nextInt(1, 101);
        Integer valorMem = ThreadLocalRandom.current().nextInt(1, 101);

        contagem++;

        somaC += valorCpu;
        somaD += valorDisk;
        somaM += valorMem;
        Integer MedCpu = somaC / contagem;
        Integer MedDisk = somaD / contagem;
        Integer MedMem = somaM / contagem;

        if (valorCpu > MaxCpu) {
            MaxCpu = valorCpu;
        }
        if (valorCpu < MinCpu) {
            MinCpu = valorCpu;
        }
        if (valorDisk > MaxDisk) {
            MaxDisk = valorDisk;
        }
        if (valorDisk < MinDisk) {
            MinDisk = valorDisk;
        }
        if (valorMem > MaxMem) {
            MaxMem = valorMem;
        }
        if (valorMem < MinMem) {
            MinMem = valorMem;
        }

        brCpu.setValue(valorCpu);
        brDisk.setValue(valorDisk);
        brMem.setValue(valorMem);

        cpuMax.setText(MaxCpu.toString() + "%");
        cpuMin.setText(MinCpu.toString() + "%");
        cpuMed.setText(MedCpu.toString() + "%");

        diskMax.setText(MaxDisk.toString() + "%");
        diskMin.setText(MinDisk.toString() + "%");
        diskMed.setText(MedDisk.toString() + "%");

        memMax.setText(MaxMem.toString() + "%");
        memMin.setText(MinMem.toString() + "%");
        memMed.setText(MedMem.toString() + "%");

    }// GEN-LAST:event_btnPrincipalActionPerformed

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {// GEN-FIRST:event_jButton1ActionPerformed
        // TODO add your handling code here:
        setContinuarMonitoramento(false);
        Login tela = new Login();
        this.setVisible(false);
        tela.setVisible(true);
    }// GEN-LAST:event_jButton1ActionPerformed

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {

        /* Set the Nimbus look and feel */
        // <editor-fold defaultstate="collapsed" desc=" Look and feel setting code
        // (optional) ">
        /*
         * If Nimbus (introduced in Java SE 6) is not available, stay with the default
         * look and feel. For details see
         * http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(Main.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(Main.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(Main.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(Main.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        // </editor-fold>
        // </editor-fold>
        // </editor-fold>
        // </editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new Main().setVisible(true);
            }
        });

    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JProgressBar brCpu;
    private javax.swing.JProgressBar brCpuClock;
    private javax.swing.JProgressBar brDisk;
    private javax.swing.JProgressBar brMem;
    private javax.swing.JLabel cpuMax;
    private javax.swing.JLabel cpuMed;
    private javax.swing.JLabel cpuMin;
    private javax.swing.JLabel diskMax;
    private javax.swing.JLabel diskMed;
    private javax.swing.JLabel diskMin;
    private javax.swing.JButton jButton1;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel12;
    private javax.swing.JLabel jLabel13;
    private javax.swing.JLabel jLabel14;
    private javax.swing.JLabel jLabel15;
    private javax.swing.JLabel jLabel16;
    private javax.swing.JLabel jLabel17;
    private javax.swing.JLabel jLabel18;
    private javax.swing.JLabel jLabel19;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel20;
    private javax.swing.JLabel jLabel21;
    private javax.swing.JLabel jLabel22;
    private javax.swing.JLabel jLabel23;
    private javax.swing.JLabel jLabel24;
    private javax.swing.JLabel jLabel25;
    private javax.swing.JLabel jLabel26;
    private javax.swing.JLabel jLabel27;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JLabel lblDiskFree;
    private javax.swing.JLabel lblMemFree;
    private javax.swing.JLabel lblTemp;
    private javax.swing.JLabel memMax;
    private javax.swing.JLabel memMed;
    private javax.swing.JLabel memMin;
    // End of variables declaration//GEN-END:variables
}
