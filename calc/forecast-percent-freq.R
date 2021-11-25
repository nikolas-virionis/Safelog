library(ggplot2)

# defining x and y
x <- amostraDesktop1$cpu_porcentagem
y <- amostraDesktop1$cpu_frequencia
dados <- data.frame(cpu_porcentagem=x, cpu_frequencia=y)

# view alfa and beta
model1 <- lm(data=dados, formula=dados$cpu_frequencia~dados$cpu_porcentagem)

# linear regression
ggplot(dados, aes(x=dados$cpu_porcentagem, y=dados$cpu_frequencia)) + geom_point() + geom_smooth(method=lm, se = FALSE)

# correlation
cor(x, y)

y <- amostraDesktop1$ram_livre

dados <- data.frame(cpu_porcentagem=x, ram_livre=y)

# view alfa and beta
model1 <- lm(data=dados, formula=dados$ram_livre~dados$cpu_porcentagem)

# linear regression
ggplot(dados, aes(x=dados$cpu_porcentagem, y=dados$ram_livre)) + geom_point() + geom_smooth(method=lm, se = FALSE)

# correlation
cor(x, y)








previsao <- function(x) {
    return(-95.432 + 1.614 * x)
}

# predict
model2 <- lm(data=dados, formula=x~y)
predict(modelo)

###################################################################################################################
# removendo x < 70
for(i in 1:578) {
    if(data2$x[i] > 70) {
        x <- c(x, data2$x[i])
        y <- c(y, data2$y[i])
    }
}

ggplot(dados, aes(x=dados$cpu_porcentagem, y=dados$cpu_frequencia)) + geom_point() + geom_smooth(method=lm, se = FALSE)

##################################################################################################################
# tratamento de dados (removendo outliers do y)
dados2 <- data.frame(cpu_porcentagem=dados$cpu_porcentagem, cpu_frequencia=dados$cpu_frequencia)

x2 <- c()
y2 <- c()

for(i in 1:578) {

    if (dados$cpu_frequencia[i] < 65 & dados$cpu_frequencia[i] > 5) {
        x2 <- c(x2, dados$cpu_porcentagem[i])
        y2 <- c(y2, dados$cpu_frequencia[i])
    }
}

dados2 <- data.frame(cpu_porcentagem=x2, cpu_frequencia=y2)

ggplot(dados2, aes(x=dados2$cpu_porcentagem, y=dados2$cpu_frequencia)) + geom_point() + geom_smooth(method=lm, se = FALSE)

cor(x2, y2))

#################################################################################################################
# tratamento de dados (removendo outliers do x)
dados3 <- data.frame(cpu_porcentagem=dados2$cpu_porcentagem, cpu_frequencia=dados2$cpu_frequencia)

x3 <- c()
y3 <- c()

for(i in 1:length(dados2$cpu_porcentagem)) {

    if (dados2$cpu_porcentagem[i] < 80 & dados2$cpu_porcentagem[i] > 68) {
        x3 <- c(x3, dados$cpu_porcentagem[i])
        y3 <- c(y3, dados$cpu_frequencia[i])
    }
}

dados3 <- data.frame(cpu_porcentagem=x2, cpu_frequencia=y2)

ggplot(dados3, aes(x=dados3$cpu_porcentagem, y=dados3$cpu_frequencia)) + geom_point() + geom_smooth(method=lm, se = FALSE)

cor(x3, y3))
