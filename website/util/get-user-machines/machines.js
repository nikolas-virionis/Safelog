const getMachines = response => {
    let string = `pk_maquina = ${response[0].pk_maquina}`;
    for (let i = 1; i < response.length; i++) {
        string += ` or pk_maquina = ${response[i].pk_maquina}`;
    }
    return string;
};

const getCategorias = categorias => {
    let string = ` fk_categoria_medicao = ${categorias[0]}`;
    for (let i = 1; i < categorias.length; i++) {
        string += ` or fk_categoria_medicao = ${categorias[i]}`;
    }
    return string;
};

module.exports = {getMachines, getCategorias};
