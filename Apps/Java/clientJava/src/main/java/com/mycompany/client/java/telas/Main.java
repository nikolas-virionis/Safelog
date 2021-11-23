package com.mycompany.client.java.telas;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JFrame;
import javax.swing.UIManager;
import javax.swing.UnsupportedLookAndFeelException;
import com.github.britooo.looca.api.group.sistema.Sistema;
import com.mycompany.client.java.*;
import com.mycompany.client.java.entidades.Medicao;
import com.mycompany.client.java.requisicoes.Alert;
import com.mycompany.client.java.util.ConfigDB;

import org.springframework.jdbc.core.JdbcTemplate;

public class Main extends javax.swing.JFrame {

    private String email;
    private static Boolean continuarMonitoramento = true;
    Thread thread;

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
            cadastroInformacoesServer();
            insertBanco();
        });
        thread.start();
    }

    public Main(String email) {
        this();

        this.setEmail(email);
        // System.out.println(email);
    }

    private void cadastroInformacoesServer() {
        String sql = String.format(
                "SELECT count(id_dados_maquina) as dadosMaquina FROM dados_maquina WHERE fk_maquina = %d",
                Monitoring.getPkMaquina());
        // jdbcTemplate;
        Integer dadosMaquina;
        try {
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAWS();
            dadosMaquina = Integer.valueOf(jdbcTemplate.queryForList(sql).get(0).get("dadosMaquina").toString());
        } catch (Exception e) {
            System.out.println("azure");
            JdbcTemplate jdbcTemplate = ConfigDB.getJdbcAzure();
            dadosMaquina = Integer.valueOf(jdbcTemplate.queryForList(sql).get(0).get("dadosMaquina").toString());
        }
        if (dadosMaquina == 0) {
            Sistema sys = new Monitoring().getSistema();
            String insertDados = String.format(
                    "INSERT INTO dados_maquina(so, arquitetura, fabricante, fk_maquina) VALUES ('%s', '%s', '%s', %d)",
                    sys.getSistemaOperacional() + " " + Monitoring.getSystemInfo(), sys.getArquitetura() + "x",
                    sys.getFabricante(), Monitoring.getPkMaquina());
            JdbcTemplate jdbcTemplateAWS = ConfigDB.getJdbcAWS();
            JdbcTemplate jdbcTemplateAzure = ConfigDB.getJdbcAzure();
            try {
                jdbcTemplateAWS.execute(insertDados);
            } catch (Exception e) {
                System.out.println("Erro na AWS");
            } finally {
                try {
                    jdbcTemplateAzure.execute(insertDados);
                } catch (Exception e) {
                    System.out.println("Erro na Azure");
                }
            }
        }
    }

    private void insertBanco() {
        List<TiposMedicao> tiposMedicao = MonitoringTypes.getTiposMedicao();
        Alert[] incidentes = new Alert[tiposMedicao.size()];
        int j = 0;
        for (TiposMedicao tipoMedicao : tiposMedicao) {
            incidentes[j] = new Alert(tipoMedicao.getFkCategoriaMedicao());
            j++;
        }

        do {
            String data = Monitoring.getDatetime();
            Medicao[] medicoes = new Medicao[tiposMedicao.size()];
            int i = 0;
            for (TiposMedicao tipo : tiposMedicao) {
                Double medicao;
                Monitoring m = new Monitoring();
                if (tipo.getTipo().equals("cpu_porcentagem")) {
                    medicao = m.getUsoCPU();
                    System.out.println("cpu uso: ");
                    System.out.println(medicao);
                    brCpu.setValue(medicao.intValue());
                    brCpu.setString(medicao.intValue() + "%");
                } else if (tipo.getTipo().equals("cpu_frequencia")) {
                    medicao = m.getClockCPU();
                    System.out.println("cpu freq");
                    brCpuClock.setValue(medicao.intValue());
                    brCpuClock.setString(medicao.intValue() + "%");
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
                    brMem.setString(medicao.intValue() + "%");
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
                    brDisk.setString(medicao.intValue() + "%");
                } else {
                    throw new RuntimeException("Erro no tipo de medicao na classe TiposMedicao");
                }
                medicoes[i] = InsertDado.formatInsert(tipo, medicao, data);
                // InsertDado.formatInsert(tipo, medicao, data);
                if (medicoes[i].getTipo() == "normal") {
                    incidentes[i].normal();
                } else {
                    incidentes[i].incidente(medicoes[i], tipo);
                }
                i++;
            }
            InsertDado.insert(medicoes);

            try {
                TimeUnit.SECONDS.sleep(1);
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

    public void alertas() {

        String selectValor = "SELECT valor FROM medicao";
        String selectTipo = "SELECT tipo FROM medicao";

    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    // @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated
    // <editor-fold defaultstate="collapsed" desc="Generated
    // <editor-fold defaultstate="collapsed" desc="Generated
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jButton2 = new javax.swing.JButton();
        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        brCpu = new javax.swing.JProgressBar();
        brDisk = new javax.swing.JProgressBar();
        brMem = new javax.swing.JProgressBar();
        jPanel2 = new javax.swing.JPanel();
        jLabel5 = new javax.swing.JLabel();
        jLabel18 = new javax.swing.JLabel();
        jButton1 = new javax.swing.JButton();
        jLabel6 = new javax.swing.JLabel();
        jLabel7 = new javax.swing.JLabel();
        jLabel8 = new javax.swing.JLabel();
        jLabel9 = new javax.swing.JLabel();
        lblSo = new javax.swing.JLabel();
        lblFabricante = new javax.swing.JLabel();
        lblArq = new javax.swing.JLabel();
        lblTempAtvd = new javax.swing.JLabel();
        btnProcessos = new javax.swing.JButton();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        brCpuClock = new javax.swing.JProgressBar();
        jLabel19 = new javax.swing.JLabel();
        jLabel20 = new javax.swing.JLabel();
        jLabel21 = new javax.swing.JLabel();
        lblTemp = new javax.swing.JLabel();
        jLabel24 = new javax.swing.JLabel();
        jLabel25 = new javax.swing.JLabel();
        jLabel26 = new javax.swing.JLabel();
        jLabel27 = new javax.swing.JLabel();
        lblDiskFree = new javax.swing.JLabel();
        lblMemFree = new javax.swing.JLabel();
        jLabel22 = new javax.swing.JLabel();
        jLabel28 = new javax.swing.JLabel();

        jButton2.setText("jButton2");

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        jPanel1.setBackground(new java.awt.Color(5, 0, 255));

        jLabel1.setFont(new java.awt.Font("Segoe UI Black", 1, 36)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(255, 255, 255));
        jLabel1.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);

        brCpu.setString("Métrica não monitorada");
        brCpu.setStringPainted(true);

        brDisk.setString("Métrica não monitorada");
        brDisk.setStringPainted(true);

        brMem.setString("Métrica não monitorada");
        brMem.setStringPainted(true);

        jPanel2.setBackground(new java.awt.Color(0, 51, 153));
        jPanel2.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        jPanel2.setForeground(new java.awt.Color(0, 102, 255));

        jLabel5.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        jLabel5.setForeground(new java.awt.Color(255, 255, 255));
        jLabel5.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel5.setText("Informações do Sistema");

        jButton1.setBackground(new java.awt.Color(0, 0, 153));
        jButton1.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        jButton1.setForeground(new java.awt.Color(255, 255, 255));
        jButton1.setText("Sair");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        jLabel6.setForeground(new java.awt.Color(255, 255, 255));
        jLabel6.setText("Sistema Operacional:");

        jLabel7.setForeground(new java.awt.Color(255, 255, 255));
        jLabel7.setText("Fabricante:");

        jLabel8.setForeground(new java.awt.Color(255, 255, 255));
        jLabel8.setText("Arquitetura:");

        jLabel9.setForeground(new java.awt.Color(255, 255, 255));
        jLabel9.setText("Tempo de Atividade");

        lblSo.setForeground(new java.awt.Color(255, 255, 255));
        lblSo.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblSo.setText("jLabel10");

        lblFabricante.setForeground(new java.awt.Color(255, 255, 255));
        lblFabricante.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblFabricante.setText("jLabel10");

        lblArq.setForeground(new java.awt.Color(255, 255, 255));
        lblArq.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblArq.setText("jLabel10");

        lblTempAtvd.setForeground(new java.awt.Color(255, 255, 255));
        lblTempAtvd.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblTempAtvd.setText("jLabel10");

        btnProcessos.setBackground(new java.awt.Color(0, 0, 153));
        btnProcessos.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        btnProcessos.setForeground(new java.awt.Color(255, 255, 255));
        btnProcessos.setText("Processos");
        btnProcessos.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnProcessosActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel18, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                        .addComponent(btnProcessos)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 71, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel5, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 264, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel9)
                                    .addComponent(jLabel8)
                                    .addComponent(jLabel7)
                                    .addComponent(jLabel6))
                                .addGap(18, 18, 18)
                                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addComponent(lblFabricante, javax.swing.GroupLayout.DEFAULT_SIZE, 111, Short.MAX_VALUE)
                                    .addComponent(lblArq, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                    .addComponent(lblTempAtvd, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                    .addComponent(lblSo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))))
                        .addContainerGap())))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel5)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 7, Short.MAX_VALUE)
                .addComponent(jLabel18)
                .addGap(18, 18, 18)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel6)
                    .addComponent(lblSo))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel7)
                    .addComponent(lblFabricante))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel8)
                    .addComponent(lblArq))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel9)
                    .addComponent(lblTempAtvd))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 183, Short.MAX_VALUE)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jButton1)
                    .addComponent(btnProcessos)))
        );

        jLabel2.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("CPU");

        jLabel3.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(255, 255, 255));
        jLabel3.setText("Memória");

        jLabel4.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(255, 255, 255));
        jLabel4.setText("Disco");

        brCpuClock.setString("Métrica não monitorada");
        brCpuClock.setStringPainted(true);

        jLabel19.setForeground(new java.awt.Color(255, 255, 255));
        jLabel19.setText("Uso:");

        jLabel20.setForeground(new java.awt.Color(255, 255, 255));
        jLabel20.setText("Frequencia:");

        jLabel21.setForeground(new java.awt.Color(255, 255, 255));
        jLabel21.setText("Temperatura:");

        lblTemp.setForeground(new java.awt.Color(255, 255, 255));
        lblTemp.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblTemp.setText("Métrica não monitorada");

        jLabel24.setForeground(new java.awt.Color(255, 255, 255));
        jLabel24.setText("Uso:");

        jLabel25.setForeground(new java.awt.Color(255, 255, 255));
        jLabel25.setText("Uso:");

        jLabel26.setForeground(new java.awt.Color(255, 255, 255));
        jLabel26.setText("Disponível: ");

        jLabel27.setForeground(new java.awt.Color(255, 255, 255));
        jLabel27.setText("Disponível: ");

        lblDiskFree.setForeground(new java.awt.Color(255, 255, 255));
        lblDiskFree.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblDiskFree.setText("Métrica não monitorada");

        lblMemFree.setForeground(new java.awt.Color(255, 255, 255));
        lblMemFree.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblMemFree.setText("Métrica não monitorada");

        jLabel22.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);

        jLabel28.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel28.setIcon(new javax.swing.ImageIcon(getClass().getResource("/com/mycompany/client/java/telas/logo-escrita-branco.png"))); // NOI18N

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addContainerGap()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 61, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                .addComponent(brMem, javax.swing.GroupLayout.PREFERRED_SIZE, 339, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGap(0, 0, Short.MAX_VALUE)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 339, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(23, 23, 23))
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addComponent(jLabel2, javax.swing.GroupLayout.PREFERRED_SIZE, 41, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(17, 17, 17)
                                        .addComponent(jLabel19, javax.swing.GroupLayout.PREFERRED_SIZE, 43, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(29, 29, 29)
                                        .addComponent(brCpu, javax.swing.GroupLayout.PREFERRED_SIZE, 339, javax.swing.GroupLayout.PREFERRED_SIZE))))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 41, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addComponent(jLabel24, javax.swing.GroupLayout.PREFERRED_SIZE, 43, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addComponent(jLabel27)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                        .addComponent(lblDiskFree, javax.swing.GroupLayout.DEFAULT_SIZE, 320, Short.MAX_VALUE)
                                        .addGap(13, 13, 13))
                                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(jLabel25)
                                            .addComponent(jLabel26))
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                            .addComponent(lblMemFree, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                            .addComponent(brDisk, javax.swing.GroupLayout.DEFAULT_SIZE, 339, Short.MAX_VALUE)))))
                            .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createSequentialGroup()
                                        .addGap(43, 43, 43)
                                        .addComponent(jLabel21, javax.swing.GroupLayout.PREFERRED_SIZE, 76, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                        .addComponent(lblTemp, javax.swing.GroupLayout.PREFERRED_SIZE, 338, javax.swing.GroupLayout.PREFERRED_SIZE))
                                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createSequentialGroup()
                                        .addGap(47, 47, 47)
                                        .addComponent(jLabel20, javax.swing.GroupLayout.PREFERRED_SIZE, 65, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(18, 18, 18)
                                        .addComponent(brCpuClock, javax.swing.GroupLayout.PREFERRED_SIZE, 339, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                .addGap(0, 0, Short.MAX_VALUE)))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(26, 26, 26)
                        .addComponent(jLabel22, javax.swing.GroupLayout.PREFERRED_SIZE, 406, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jLabel28, javax.swing.GroupLayout.PREFERRED_SIZE, 396, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(39, 39, 39)))
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGap(14, 14, 14)
                .addComponent(jLabel1)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 17, Short.MAX_VALUE)
                        .addComponent(jLabel22)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jLabel28)
                        .addGap(33, 33, 33)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel2)
                            .addComponent(brCpu, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(jLabel19))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(brCpuClock, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(jLabel20))
                        .addGap(24, 24, 24)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel21)
                            .addComponent(lblTemp))
                        .addGap(18, 18, 18)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(brMem, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel24)
                            .addComponent(jLabel3))
                        .addGap(18, 18, 18)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel26)
                            .addComponent(lblMemFree))
                        .addGap(23, 23, 23)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(brDisk, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel25)
                            .addComponent(jLabel4))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(lblDiskFree)
                            .addComponent(jLabel27))
                        .addGap(46, 46, 46))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(11, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {// GEN-FIRST:event_jButton1ActionPerformed
        // TODO add your handling code here:
        setContinuarMonitoramento(false);
        Login tela = new Login();
        this.setVisible(false);
        tela.setVisible(true);
    }// GEN-LAST:event_jButton1ActionPerformed

    private void btnProcessosActionPerformed(java.awt.event.ActionEvent evt) {// GEN-FIRST:event_btnProcessosActionPerformed
        // TODO add your handling code here:
        formProcessos frameProcs = new formProcessos();
        frameProcs.setDefaultCloseOperation(JFrame.HIDE_ON_CLOSE);
        frameProcs.setVisible(true);
        frameProcs.pack();
        frameProcs.setLocationRelativeTo(null);
    }

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
    private javax.swing.JButton btnProcessos;
    private javax.swing.JButton jButton1;
    private javax.swing.JButton jButton2;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel18;
    private javax.swing.JLabel jLabel19;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel20;
    private javax.swing.JLabel jLabel21;
    private javax.swing.JLabel jLabel22;
    private javax.swing.JLabel jLabel24;
    private javax.swing.JLabel jLabel25;
    private javax.swing.JLabel jLabel26;
    private javax.swing.JLabel jLabel27;
    private javax.swing.JLabel jLabel28;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JLabel lblArq;
    private javax.swing.JLabel lblDiskFree;
    private javax.swing.JLabel lblFabricante;
    private javax.swing.JLabel lblMemFree;
    private javax.swing.JLabel lblSo;
    private javax.swing.JLabel lblTemp;
    private javax.swing.JLabel lblTempAtvd;
    // End of variables declaration//GEN-END:variables
}
