const generateId = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789".repeat(2);
    let userId = chars.split(""); // cada caracter vira um elemento da array userId
    userId = userId.sort(() => Math.random() - 0.5); // embaralha os elementos da array (pseudo)aleatoriamente
    userId = userId.slice(0, 8); // retira os 8 primeiros digitos
    userId = userId.join(""); // junta os 8 elementos em uma só string
    return userId;
};
module.exports = { generateId };
