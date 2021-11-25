# Criação do Billing/Forecast Safelog
forecast_safelog <- data.frame(Maquina = c(101,201,309,443,522,633),
                              Nome = c("Nikolas","Amanda", "Joao Pedro", "Lucas Mesquita",
                                      "Lucas Menezes", "Felipe Cruz"),
                              Gasto = c(5.99, 4.68,4.62, 12.84, 6.09, 4.92))

# Criaçao dos DataSets de cada Maquina
data_nikolas <- data.frame(c(0, 5.99), c(0,2)) 
data_amanda <- data.frame(c(0, 4.68), c(0,2))
data_joao <- data.frame(c(0, 4.62), c(0,2))
data_lucasm <- data.frame(c(0, 12.84), c(0,2))
data_lucasm2 <- data.frame(c(0, 6.09), c(0,2))
data_felipe <- data.frame(c(0,4.92), c(0,2))

# Regressao Linear

reg_nikolas <- ggplot(data_nikolas, aes(x=data_nikolas$c.0..5.99., y=data_nikolas$c.0..2.))+
  geom_point() + geom_smooth(method=lm, se = FALSE)

reg_amanda <- ggplot(data_amanda, aes(x=data_amanda$c.0..4.68., y=data_amanda$c.0..2.))+
  geom_point() + geom_smooth(method=lm, se = FALSE)

reg_joao <- ggplot(data_joao, aes(x=data_joao$c.0..4.62., y=data_joao$c.0..2.))+
  geom_point() + geom_smooth(method=lm, se = FALSE)

reg_lucasm <- ggplot(data_lucasm, aes(x=data_lucasm$c.0..12.84., y=data_lucasm$c.0..2.))+
  geom_point() + geom_smooth(method=lm, se = FALSE)

reg_lucasm2 <- ggplot(data_lucasm2, aes(x=data_lucasm2$c.0..6.09., y=data_lucasm2$c.0..2.))+
  geom_point() + geom_smooth(method=lm, se = FALSE)

reg_felipe <- ggplot(data_felipe, aes(x=data_felipe$c.0..4.92., y=data_felipe$c.0..2.))+
  geom_point() + geom_smooth(method=lm, se = FALSE)


