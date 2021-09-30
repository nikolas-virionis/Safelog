const getMachines = (response) => {
    let string = `id_maquina = '${response[0].id_maquina}'`;
    for (let i = 1; i < response.length; i++) {
        string += ` or id_maquina = '${response[i].id_maquina}'`;
    }
    return string;
};

module.exports = { getMachines };
