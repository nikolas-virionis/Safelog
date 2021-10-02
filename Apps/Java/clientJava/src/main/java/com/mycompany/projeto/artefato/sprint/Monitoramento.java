package com.mycompany.projeto.artefato.sprint;

import com.github.britooo.looca.api.core.Looca;
import java.util.List;

import oshi.SystemInfo;
import oshi.hardware.NetworkIF;
import oshi.hardware.CentralProcessor;
import oshi.hardware.ComputerSystem;
import oshi.hardware.HWDiskStore;

public class Monitoramento extends Looca {

   
    public String getMacAddress(){
        SystemInfo sys = new SystemInfo();
        List<NetworkIF> netIfs = sys.getHardware().getNetworkIFs();
        return netIfs.get(0).getMacaddr();
    }
    
    public String getBaseBoardSerial(){
        SystemInfo sys = new SystemInfo();
        ComputerSystem pc = sys.getHardware().getComputerSystem();
        return pc.getBaseboard().getSerialNumber();
    }
    
    public String getHDSerial(){
        SystemInfo sys = new SystemInfo();
        List<HWDiskStore> stores = sys.getHardware().getDiskStores();
        return stores.get(0).getSerial();
    }
}
