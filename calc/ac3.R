library(ggplot2)

# correlação (cpu_percent, cpu_frequencia)

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


# correlação cpu_porcentagem, ram_livre)

# ram livre
y <- amostraDesktop1$ram_livre

dados <- data.frame(cpu_porcentagem=x, ram_livre=y)

# view alfa and beta
model1 <- lm(data=dados, formula=dados$ram_livre~dados$cpu_porcentagem)

# linear regression
ggplot(dados, aes(x=dados$cpu_porcentagem, y=dados$ram_livre)) + geom_point() + geom_smooth(method=lm, se = FALSE)

# correlation
cor(x, y)