# simples
juro_simples <- function(capital, indice, mes) {
    montante <- capital + (capital * indice * mes)
    return(montante)
}

# composto
juro_composto <- function(capital, indice, mes) {
    montante <- capital * ((1 + indice) ** mes)
    return(montante)
}

# outubro
indice = 0.03
cont = 0
juros_outubro = 0

for (m in 10:12) {
    cont = cont + 1

    if(cont == 1) {
        valor_mes = forecast$preco[m]   
        juros_outubro[cont] = juro_simples(valor_mes, indice, cont)
    } else {
        juros_outubro[cont] = juro_composto(valor_mes, indice, cont)
    }
}

# novembro
juros_novembro = 0 
cont = 0

for (m in 11:12) {
    cont = cont + 1
    print(cont)
    if(cont == 1) {
        valor_mes = forecast$preco[m]   
        juros_novembro[cont] = juro_simples(valor_mes, indice, cont)
    } else {
        juros_novembro[cont] = juro_composto(valor_mes, indice, cont)
    }
}
