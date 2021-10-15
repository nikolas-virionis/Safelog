const getMachines = (response) => {
    let string = `pk_maquina = ${response[0].pk_maquina}`;
    for (let i = 1; i < response.length; i++) {
        string += ` or pk_maquina = ${response[i].pk_maquina}`;
    }
    return string;
};

module.exports = { getMachines };
