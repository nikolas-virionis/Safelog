# correlação


# comportamento - porcentagem de cpu
dados <- data.frame(x=1:578, y=x)
ggplot(dados, aes(x=dados$x, y=dados$y)) + geom_smooth(method=lm, se = FALSE)
