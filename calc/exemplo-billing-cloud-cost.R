# meses
x <-c(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

# custo
y<- c(59, 68, 81, 50, 57, 90, 65, 88, 54, 70)

dados <- data.frame(mes=x, preco=y)

# modelo 
modelo1 <- lm(data=dados, formula=dados$preco~dados$mes)
print(modelo1)

# correlação
correlacao <- cor(y, x)

# previsao
previsao <- function(mes) {
    valor = round(64.4 + mes * 0.6909)
    return(valor)
}

# adicionando meses restantes
x <- c(x, 11, 12)

# adicionando previsões dos meses restantes
y <- c(y, previsao(11), previsao(12))

forecast <- data.frame(mes=x, preco=y)

barplot(forecast$preco, forecast$mes)
plot(x=forecast$mes, y=forecast$preco, type='l')

