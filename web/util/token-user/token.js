const generateToken = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789".repeat(3);
    let userToken = chars.split(""); // cada caracter vira um elemento da array userToken
    userToken = userToken.sort(() => Math.random() - 0.5); // embaralha os elementos da array (pseudo)aleatoriamente
    userToken = userToken.slice(0, 16); // retira os 16 primeiros digitos
    userToken = userToken.join(""); // junta os 16 elementos em uma só string
    return userToken;
};
module.exports = { generateToken };
