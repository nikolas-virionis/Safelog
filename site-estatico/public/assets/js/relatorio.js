let alertarSup = document.querySelectorAll(".btn-nav-dash");
alertarSup.forEach((btn) => (btn.title = "Alertar Responsável"));
// for (let btn of alertarSup) btn.title = "Alertar Responsável";

// ////////////////////////////////////////////////////////////////////

let estadosAlerta = document.querySelectorAll(
  ".tabela-listrada table tr td:nth-child(4)"
);
estadosAlerta.forEach((estado) =>
  estado.innerHTML == "Crítico"
    ? (estado.parentElement.style.color = "red")
    : ""
);
// for (let estado of estadosAlerta) {
//   if (estado.innerHTML == "Crítico") {
//     estado.parentElement.style.color = "red";
//   }
// }
