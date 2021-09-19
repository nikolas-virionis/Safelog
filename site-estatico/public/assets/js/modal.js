const abrirModal = (modalId) =>
    (document.getElementById(modalId).style.display = "flex");
export const fecharModal = (modalId) =>
    (document.getElementById(modalId).style.display = "none");
export const cancelarModal = () => window.history.back();
