const criptografarNome = nome => {
    let nomes = nome.split(" ")
    let parteOculta = nomes.slice(1)
    let sobrenome = parteOculta.map(element => "*".repeat(element.length));
    return `${nomes[0].charAt(0).toUpperCase() + nomes[0].slice(1)} ${sobrenome.join(" ")}`
}
// console.log(criptografarNome("nicolas azevedo cruz"))
module.exports = { criptografarNome }