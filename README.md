# 1CCO-2021-2-Grupo-06
Grupo06_1CCO_2021_2 - Repositório criado para a disciplina de Pesquisa e Inovação

![Safelog Logo](./web/public/assets/img/logo/logo-escrita-branco.png)

- [Setup](#setup)

## Setup

### Requisitos:
- MySQL Server 8.0
- Node 14
- Git (Opcional)

### Clonar repositório

https

~~~bash
git clone https://github.com/BandTec/1CCO-2021-2-Grupo-06.git
~~~

ssh

~~~bash
git clone git@github.com:BandTec/1CCO-2021-2-Grupo-06.git
~~~

Se você não tiver o git, pode baixar o .zip do repositório.

### Banco de dados

1. Abra o terminal na pasta do projeto

2. Abra o mysql como root

    ~~~bash
    mysql -u root -p
    ~~~

3. Construir bancos

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
### Server

1. Com o **Terminal** aberto no diretório do repositório, acesse o diretório *site-estatico*

    ~~~bash
    cd ./site-estatico/
    ~~~
2. Installe as dependências

    ~~~bash
    npm i
    ~~~
    
3. Adicione o arquivo .env ao diretório *site-estatico*
    
4. Inicie o servidor
    
    Ambiente de desenvolvimento:
    
    ~~~bash
    npm run dev
    ~~~
    
    Ambiente de produção
    
    ~~~bash
    npm start
    ~~~
