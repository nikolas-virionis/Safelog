library(ggplot2)

# defining x and y
x <- amostraDesktop1$cpu_porcentagem
y <- amostraDesktop1$cpu_frequencia
dados <- data.frame(cpu_porcentagem=x, cpu_frequencia=y)

# view alfa and beta
lm(data=dados, formula=dados$cpu_frequencia~dados$cpu_porcentagem)

# linear regression
ggplot(dados, aes(x=dados$cpu_porcentagem, y=dados$cpu_frequencia)) + geom_point() + geom_smooth(method=lm, se = FALSE)

# correlation
cor(x, y)

previsao <- function(x) {
    return(-95.432 + 1.614 * x)
}



# predict
modelo <- lm(data=dados, formula=x~y)
predict(modelo)


for(i in 1:578) {
    if(data2$x[i] > 70) {
        x <- c(x, data2$x[i])
        y <- c(y, data2$y[i])
    }
}