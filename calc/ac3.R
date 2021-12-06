library(ggplot2)

# correlação CPU percent - RAM LIVRE
y <- amostraDesktop1$cpu_porcentagem
x <- amostraDesktop1$cpu_frequencia
dados <- data.frame(cpu_frequencia=x, cpu_porcentagem=y)
ggplot(dados, aes(x=dados$cpu_frequencia, y=dados$cpu_porcentagem)) + geom_point() + geom_smooth(method=lm, se = FALSE)

# comportamento - porcentagem de cpu
dados <- data.frame(x=1:length(x), y=x)
ggplot(dados, aes(x=dados$x, y=dados$y)) + geom_smooth(method=lm, se = FALSE)