# Carregando as bibliotecas
library(wordcloud)
library(RColorBrewer)

# palavras que vão aparecer no wordCloud
words ＜- c("R ", "Python","chorme","zoom","opera.exe","nodejs","mysql",
"discord","VsCode","Gerenciador de tarefas","csrss.exe","winlogon.exe"
 ,"NVIDIA Web Helper.exe","Lenovo.Modern.ImControlle","RuntimeBroker.exe",
 "Win32","spotify","TabNine.exe","Code.exe","Lenovo.Modern.ImControlle",
 "tasklist.exe","ShellExperienceHost.exe","notpad.exe","telegram.exe","dllhost.exe")

# Freq que elas vão aparecer no wordCloud
freqs ＜- c(100, 70, 90, 50, 80, 20, 30, 30, 20, 
           10, 70, 40, 20, 15, 15, 25, 5, 5,
           15, 25, 35, 50, 30, 20, 30)

set.seed(3)

wordcloud(words = words,
          freq = freqs,
          max.words = 100,
          colors = brewer.pal(8,"Dark2"))