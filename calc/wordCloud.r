# Carregando as bibliotecas
library(wordcloud)
library(RColorBrewer)

# palavras que vão aparecer no wordCloud
words <- c("R ", "Python","chorme","zoom","opera.exe","nodejs","mysql",
"discord","VsCode","Gerenciador de tarefas","csrss.exe","winlogon.exe"
 ,"NVIDIA Web Helper.exe","Lenovo.Modern.ImControlle","RuntimeBroker.exe",
 "Win32","spotify","TabNine.exe","Code.exe","Lenovo.Modern.ImControlle",
 "tasklist.exe","ShellExperienceHost.exe","notpad.exe","telegram.exe","dllhost.exe")

# Freq que elas vão aparecer no wordCloud
set.seed(1234)
#var <- runif(25, min=10, max=100)

freqs <- c()
for (variable in 1:25) {
  freqs <- c(freqs, round(runif(1,0,500)))
}


wordcloud(words = words,
          freq = freqs,
          scale = c(2.5,0.5),
          colors = brewer.pal(8,"Dark2"))