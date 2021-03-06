const getTrendBehavior = deg => {
    let orientacao, comportamento;
    if (Math.abs(deg) < 0.01) {
        orientacao = "constante";
        comportamento = "";
    } else {
        if (deg >= 0) {
            orientacao = "crescimento";
        } else {
            orientacao = "decrescimento"; // "atenuamento"
        }

        if (Math.abs(deg) < 1) {
            comportamento = "mínimo";
        } else if (Math.abs(deg) < 10) {
            comportamento = "leve";
        } else if (Math.abs(deg) < 25) {
            comportamento = "moderado";
        } else if (Math.abs(deg) < 40) {
            comportamento = "considerável";
        } else {
            comportamento = "drástico";
        }
    }
    return {orientacao, comportamento};
};

module.exports = {getTrendBehavior};
