# 1CCO-2021-2-Grupo-06
Grupo06_1CCO_2021_2 - Repositório criado para a disciplina de Pesquisa e Inovação

- [Setup](#setup)

## Setup

### Clonar repositório

https

~~~bash
git clone https://github.com/BandTec/1CCO-2021-2-Grupo-06.git
~~~

ssh

~~~bash
git clone git@github.com:BandTec/1CCO-2021-2-Grupo-06.git
~~~

### Banco de dados

1. Abrir terminal na pasta do projeto

2. Abrir mysql como root

    ~~~bash
    mysql -u root -p
    ~~~

3. Construir banco

    Principal
    ~~~bash
    source ./bd/BDSafelog.sql
    ~~~

    Analytcs
    ~~~bash
    source ./bd/BDAnalytics.sql
    ~~~ 

4. Criar usuário de desenvolvimento.

    ~~~bash
    CREATE USER 'safelog_dev' @'localhost' IDENTIFIED BY 'Safe_Log371$';
    ~~~

5. Garantir privilégios do usuário.

    ~~~bash
    GRANT ALL PRIVILEGES ON `safelog_analytics`.* TO `safelog_dev` @`localhost`;
    ~~~

6. Atualizar privilégios de usuários.

    ~~~bash
    FLUSH PRIVILEGES;
    ~~~ 