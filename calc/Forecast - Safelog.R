# Criação do Billing/Forecast Safelog
forecast_safelog <- data.frame(Maquina = c(101,201,309,443,522,633),
                              Nome = c("Nikolas","Amanda", "Joao Pedro", "Lucas Mesquita",
                                      "Lucas Menezes", "Felipe Cruz"),
                              Gasto = c(5.99, 4.68,4.62, 12.84, 6.09, 4.92))

# Criaçao dos DataSets de cada Maquina
data_nikolas <- data.frame(y = c(0, 5.99), x = c(0,2)) 
data_amanda <- data.frame(y = c(0, 4.68), x = c(0,2))
data_joao <- data.frame(y = c(0, 4.62), x = c(0,2))
data_lucasm <- data.frame(y = c(0, 12.84), x = c(0,2))
data_lucasm2 <- data.frame(y = c(0, 6.09), x =  c(0,2))
data_felipe <- data.frame(y = c(0,4.92), x = c(0,2))

# Coeficiente Angular

print(lm(data_nikolas$y~data_nikolas$x)) 

print(lm(data_amanda$y~data_amanda$x))

print(lm(data_joao$y~data_joao$x))

print(lm(data_lucasm$y~data_lucasm$x))

print(lm(data_lucasm2$y~data_lucasm2$x))

print(lm(data_felipe$y~data_felipe$x))


# Media do Coeficiente Angular

media <- mean(2.99, 2.34, 2.31, 6.42, 3.04, 2.46)

# Formula
y = 2.99*x

# Grafico

curve(x*2.99, from = 0.5, to = 4, xlab = "meses", ylab = "gasto")



