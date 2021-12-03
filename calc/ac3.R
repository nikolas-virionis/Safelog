library(ggplot2)

# correlação CPU percent - RAM LIVRE
x <- amostraDesktop1$cpu_porcentagem
y <- amostraDesktop1$cpu_frequencia
dados <- data.frame(cpu_porcentagem=x, cpu_frequencia=y)
ggplot(dados, aes(x=dados$cpu_porcentagem, y=dados$cpu_frequencia)) + geom_point() + geom_smooth(method=lm, se = FALSE)

# comportamento - porcentagem de cpu
dados <- data.frame(x=1:578, y=x)
ggplot(dados, aes(x=dados$x, y=dados$y)) + geom_smooth(method=lm, se = FALSE)
