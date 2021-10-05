document.querySelector("#checkCpu").addEventListener("click", (e) => {
    if(checkCpu.checked){
        document.querySelector("#componentesCpu.lista-medicoes").style.display = "block";
    }else{
        document.querySelector("#componentesCpu.lista-medicoes").style.display = "none";
    }
});
document.querySelector("#checkMem").addEventListener("click", (e) => {
    if(checkMem.checked){
        // alert("vazio")
        document.querySelector("#componentesMem.lista-medicoes").style.display = "block";
    }else{
        document.querySelector("#componentesMem.lista-medicoes").style.display = "none";
    }
});
document.querySelector("#checkDis").addEventListener("click", (e) => {
    if(checkDis.checked){
        // alert("vazio")
        document.querySelector("#componentesDis.lista-medicoes").style.display = "block";
    }else{
        document.querySelector("#componentesDis.lista-medicoes").style.display = "none";
    }
});


for(let i = 1; i <= 7; i++){
    
    document.querySelector("#medicao"+i).addEventListener("click", (e) => {
        if(document.querySelector("#medicao"+i).checked){
            document.querySelector("#limite"+i).disabled = false;            
            if(i == 3 || i == 5 || i == 7){
                document.querySelector("#limite"+i).style.borderBottom = '3px solid #0077ff';
            }
        }else{
            document.querySelector("#limite"+i).disabled = true;
            if(i == 3 || i == 5 || i == 7){
                document.querySelector("#limite"+i).style.borderBottom = '3px solid #cccccc';
            }
        }
    });

    document.querySelector("#limite"+i).addEventListener("mousemove", (e) => {
        let valor = document.querySelector("#limite"+i).value;
        document.querySelector("#rangeValue"+i).innerHTML = valor+"%";
    });
}
