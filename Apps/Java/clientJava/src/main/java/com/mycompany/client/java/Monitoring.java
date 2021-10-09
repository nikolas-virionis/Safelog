package com.mycompany.client.java;

import com.github.britooo.looca.api.core.Looca;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import oshi.SystemInfo;
import oshi.hardware.NetworkIF;
import oshi.hardware.CentralProcessor;
import oshi.hardware.HardwareAbstractionLayer;

public class Monitoring extends Looca {

    public static HardwareAbstractionLayer getSystemHardware() {
        SystemInfo sys = new SystemInfo();
        return sys.getHardware();
    }

    public static String getMacAddress() {
        List<NetworkIF> netIfs = getSystemHardware().getNetworkIFs();
        return netIfs.get(0).getMacaddr();
    }

    public Double getTemp() {
        return Math.round(super.getTemperatura().getTemperatura() * 100) / 100d;
    }

    public Double getClockCPU() {
        CentralProcessor cpu = getSystemHardware().getProcessor();
        Long maxFreq = cpu.getMaxFreq();
        Long freq = cpu.getCurrentFreq()[0];
        return Math.round((freq * 10000) / (maxFreq)) / 100d;
    }

    public Double getUsoCPU() {
        return Math.round(super.getProcessador().getUso() * 100) / 100d;
    }

    public Double getUsoRAMGb() {
        return Math.round(super.getMemoria().getEmUso() * 100 / 1_073_741_824) / 100d;
    }

    public Double getFreeRAMGb() {
        return Math.round(
                super.getMemoria().getDisponivel() * 100 / 1_073_741_824) / 100d;
    }

    public Double getTotalRAMGb() {
        return Math.round(super.getMemoria().getTotal() * 100 / 1_073_741_824) / 100d;
    }

    public Double getUsoDiscoGb() {
        return (getTotalDiscoGb() - getFreeDiscoGb());
    }

    public Double getTotalDiscoGb() {
        return Math.round(new SystemInfo().getOperatingSystem().getFileSystem().getFileStores().get(0).getTotalSpace() * 100 / 1_073_741_824) / 100d;
    }

    public Double getFreeDiscoGb() {
        return Math.round((new SystemInfo().getOperatingSystem().getFileSystem().getFileStores().get(0).getFreeSpace()) * 100 / 1_073_741_824) / 100d;
    }

    public Double getFreeDisco() {
        return Math.round((getFreeDiscoGb() * 100 / getTotalDiscoGb()) * 100) / 100d;
    }

    public Double getUsoDisco() {
        return Math.round((getUsoDiscoGb() * 100 / getTotalDiscoGb()) * 100) / 100d;
    }

    public Double getFreeRAM() {
        return Math.round((getFreeRAMGb() * 100 / getTotalRAMGb()) * 100) / 100d;
    }

    public Double getUsoRAM() {
        return Math.round((getUsoRAMGb() * 100 / getTotalRAMGb()) * 100) / 100d;
    }

    public static String getDatetime() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern(
                "yyyy-MM-dd HH:mm:ss");
        LocalDateTime now = LocalDateTime.now();
        return dtf.format(now);
    }

    @Override
    public String toString() {
        return String.format(
                "Monitoramento Servidor: %s: " + "\n\tTemperatura: %.2fºC\n\t" + "Uso de CPU: %.2f%% \n\t"
                + "Clock CPU: %.2f%% \n\t" + "Uso de RAM: %.2f%% \n\t" + "RAM Disponível: %.2fGb \n\t"
                + "RAM Total: %.2fGb \n\t" + "Uso de Disco: %.2f%% \n\t" + "Disco Disponível: %.2fGb \n\t"
                + "Disco Total: %.2fGb \n\t",
                getMacAddress(), getTemp(), getUsoCPU(), getClockCPU(),
                getUsoRAM(), getFreeRAMGb(), getTotalRAMGb(),
                getUsoDisco(), getFreeDiscoGb(), getTotalDiscoGb());
    }

}
