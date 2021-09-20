export const abrirModal = (modalId) => {
    document.getElementById(modalId).style.display = "flex";
    document.getElementById("email-convite").focus();
};
export const fecharModal = (modalId) =>
    (document.getElementById(modalId).style.display = "none");
export const cancelarModal = () => window.history.back();
