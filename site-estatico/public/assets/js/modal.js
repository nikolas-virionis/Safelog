const abrirModal = (modalId) =>
  (document.getElementById(modalId).style.display = "flex");
const fecharModal = (modalId) =>
  (document.getElementById(modalId).style.display = "none");
const cancelarModal = () => window.history.back();
