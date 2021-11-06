const getTrendDeg = medicoes => {
    const radsToDegs = rad => (rad * 180) / Math.PI;

    let n = medicoes.length;
    let x = [...medicoes];
    let y = [...Array(n).keys()];

    let soma = 0;
    for (let i in x) {
        soma += x[i] * y[i];
    }
    let a = 3 * soma;

    let sumX = 0;
    for (const iterator of x) {
        sumX += iterator;
    }
    let sumY = 0;
    for (const iterator of y) {
        sumY += iterator;
    }
    let b = sumY * sumX;

    let c = 3 * [...x.map(el => el ** 2)].reduce((ac, el) => (ac += el));

    let d = sumX ** 2;

    let slope = (a - b) / (c - d);
    let deg = radsToDegs(Math.atan(slope));

    return deg;
};

const getTrendBehavior = deg => {
    let orientacao, comportamento;
    if (deg >= -1 && deg <= 1) {
        orientacao = "horizontal";
        comportamento = "";
    } else {
        if (deg >= 0) {
            orientacao = "crescimento";
        } else {
            orientacao = "atenuamento"; // "atenuamento"
        }

        if (Math.abs(deg) < 10) {
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

module.exports = {getTrendDeg, getTrendBehavior};
