library(ggplot2)

# defining x and y
x <- amostraDesktop1$cpu_porcentagem
y <- amostraDesktop1$cpu_frequencia
dados <- data.frame(percent=x, freq=y)

# view alfa and beta
lm(x~y)

# linear regression
ggplot(dados, aes(x=x, y=y)) + geom_point() + geom_smooth(method=lm, se = FALSE)

# correlation
cor(x, y)

# predict
modelo <- lm(data=dados, formula=x~y)
predict(modelo)