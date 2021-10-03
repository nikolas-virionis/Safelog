package com.mycompany.client.java;

import com.github.britooo.looca.api.core.Looca;
import java.util.List;

import oshi.SystemInfo;
import oshi.hardware.NetworkIF;
import oshi.hardware.ComputerSystem;
import oshi.hardware.HWDiskStore;
import oshi.hardware.HardwareAbstractionLayer;

public class Monitoring extends Looca {

    public static String getMacAddress() {
        List<NetworkIF> netIfs = getSystemHardware().getNetworkIFs();
        return netIfs.get(0).getMacaddr();
    }

    public static HardwareAbstractionLayer getSystemHardware() {
        SystemInfo sys = new SystemInfo();
        return sys.getHardware();
    }

    @Override
    public String toString() {
        return String.format("Monitoramento Looca %s: "
                + "\n\tgetTemperatura().getTemperatura(): %s\n\t"
                + "getProcessador().getUso(): %s \n\t"
                + "getProcessador().getFrequencia(): %s \n\t"
                + "getMemoria().getEmUso(): %s \n\t"
                + "getMemoria().getDisponivel(): %s \n\t"
                + "getMemoria().getTotal(): %s \n\t"
                + "getGrupoDeDiscos().getDiscos().get(0).getTamanho(): %s \n\t"
                + "getGrupoDeDiscos().getDiscos().get(0).getBytesDeEscritas(): %s \n\t"
                + "getGrupoDeDiscos().getDiscos().get(0).getBytesDeLeitura(): %s \n\t",
                getMacAddress(),
                getTemperatura().getTemperatura(),
                getProcessador().getUso(),
                getProcessador().getFrequencia(),
                getMemoria().getEmUso(),
                getMemoria().getDisponivel(),
                getMemoria().getTotal(),
                getGrupoDeDiscos().getDiscos().get(0).getTamanho(),
                getGrupoDeDiscos().getDiscos().get(0).getBytesDeEscritas(),
                getGrupoDeDiscos().getDiscos().get(0).getBytesDeLeitura());
    }

}
