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

module.exports = {getTrendDeg};
