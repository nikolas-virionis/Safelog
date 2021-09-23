leituraCpu.innerHTML = cpuRange.value;
leituraMemory.innerHTML = memoryRange.value;
leituraDisk.innerHTML = diskRange.value;
document.getElementById("cpuRange").addEventListener("mousemove", () => {
    leituraCpu.innerHTML = cpuRange.value;
})
document.getElementById("memoryRange").addEventListener("mousemove", () => {
    leituraMemory.innerHTML = memoryRange.value;
})
document.getElementById("diskRange").addEventListener("mousemove", () => {
    leituraDisk.innerHTML = diskRange.value;
})