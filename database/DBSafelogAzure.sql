CREATE TABLE staff (
    id_staff INT PRIMARY KEY IDENTITY(1, 1),
    nome INT(60) NOT NULL,
    email INT(60) NOT NULL UNIQUE,
    senha CHAR(32) NOT NULL,
    token CHAR(16)
);

CREATE TABLE empresa (
    id_empresa INT(30) PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    pais VARCHAR(50) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    foto VARCHAR(200),
    fk_staff INT NOT NULL,
    FOREIGN KEY(fk_staff) REFERENCES staff(id_staff)
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY IDENTITY(1, 1),
    nome VARCHAR(60),
    email VARCHAR(60) NOT NULL UNIQUE,
    senha VARCHAR(32),
    cargo VARCHAR(8) CHECK(cargo IN ('admin', 'gestor', 'analista')),
    foto VARCHAR(200),
    token CHAR(16),
    fk_empresa VARCHAR(30) NOT NULL,
    fk_supervisor INT,
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
    FOREIGN KEY (fk_supervisor) REFERENCES usuario(id_usuario)
);

CREATE TABLE notificacao (
    id_notificacao INT PRIMARY KEY IDENTITY(1, 1),
    titulo VARCHAR(60),
    mensagem TEXT,
    tipo VARCHAR(11) CHECK(tipo IN ('notificacao', 'alerta'))
);

CREATE TABLE usuario_notificacao (
    id_usuario_notificacao INT PRIMARY KEY IDENTITY(1, 1),
    lido CHAR(1) CHECK(lido IN('s', 'n')),
    data_notificacao DATETIME,
    fk_usuario INT,
    fk_notificacao INT,
    FOREIGN KEY(fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY(fk_notificacao) REFERENCES notificacao(id_notificacao)
);

CREATE TABLE forma_contato (
    id_forma_contato int PRIMARY KEY IDENTITY(1, 1),
    nome varchar(45)
);

CREATE TABLE contato (
    fk_usuario INT,
    id_contato INT,
    valor VARCHAR(80),
    identificador varchar(200),
    fk_forma_contato INT,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_forma_contato) REFERENCES forma_contato(id_forma_contato),
    PRIMARY KEY (fk_usuario, id_contato)
);

CREATE TABLE maquina (
    pk_maquina INT IDENTITY(1, 1) PRIMARY KEY,
    id_maquina VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(60) NOT NULL,
    senha char(32) NOT NULL,
    fk_empresa VARCHAR(30) NOT NULL,
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);

CREATE TABLE usuario_maquina (
    id_usuario_maquina INT IDENTITY(1, 1) PRIMARY KEY,
    responsavel CHAR(1) CHECK(responsavel IN ('s', 'n')),
    fk_usuario INT NOT NULL,
    fk_maquina INT NOT NULL,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_maquina) REFERENCES maquina(pk_maquina)
);

CREATE TABLE dados_maquina (
    id_dados_maquina INT IDENTITY(1, 1) PRIMARY KEY,
    so VARCHAR(80),
    arquitetura VARCHAR(10),
    fabricante VARCHAR(45),
    fk_maquina INT,
    FOREIGN KEY (fk_maquina) REFERENCES maquina(pk_maquina)
);

CREATE TABLE tipo_medicao (
    id_tipo_medicao int PRIMARY KEY IDENTITY(1, 1),
    tipo VARCHAR(45),
    unidade VARCHAR(7)
);

CREATE TABLE categoria_medicao (
    id_categoria_medicao int PRIMARY KEY IDENTITY(1, 1),
    medicao_limite DECIMAL(6, 2),
    fk_maquina INT NOT NULL,
    fk_tipo_medicao INT,
    FOREIGN KEY (fk_maquina) REFERENCES maquina(pk_maquina),
    FOREIGN KEY (fk_tipo_medicao) REFERENCES tipo_medicao(id_tipo_medicao)
);

CREATE TABLE medicao (
    id_medicao INT PRIMARY KEY IDENTITY(1, 1),
    valor DECIMAL(7, 2),
    tipo VARCHAR(7) CHECK(tipo IN ('normal', 'risco', 'critico')),
    data_medicao DATETIME,
    fk_categoria_medicao INT,
    FOREIGN KEY (fk_categoria_medicao) REFERENCES categoria_medicao (id_categoria_medicao)
);

CREATE TABLE chamado (
    id_chamado INT IDENTITY(1, 1) PRIMARY KEY,
    titulo VARCHAR(60) NOT NULL,
    descricao TEXT,
    data_abertura DATETIME NOT NULL,
    status_chamado VARCHAR(7) CHECK(status_chamado IN ('aberto', 'fechado')) NOT NULL,
    prioridade VARCHAR(10) CHECK(prioridade IN ('baixa', 'media', 'alta', 'emergencia')) NOT NULL,
    automatico CHAR(1) CHECK(automatico IN ('s', 'n')) NOT NULL,
    fk_categoria_medicao INT NOT NULL,
    fk_usuario INT NOT NULL,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_categoria_medicao) REFERENCES categoria_medicao(id_categoria_medicao)
);

CREATE TABLE solucao (
    id_solucao INT PRIMARY KEY IDENTITY,
    titulo VARCHAR(60) NOT NULL,
    descricao TEXT NOT NULL,
    data_solucao DATETIME NOT NULL,
    eficacia VARCHAR(7) CHECK(eficacia IN ('nula', 'parcial', 'total')) NOT NULL,
    fk_chamado INT NOT NULL,
    fk_usuario INT NOT NULL,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_chamado) REFERENCES chamado(id_chamado)
);

INSERT INTO
    forma_contato(nome)
VALUES
    ('whatsapp'),
    ('telegram'),
    ('slack');

INSERT INTO
    staff(nome, email, senha)
VALUES
    (
        'Amanda Caramico',
        'amanda.caramico@bandtec.com.br',
        HASHBYTES('MD5', 'ExSenha1')
    ),
    (
        'Felipe Cruz',
        'felipe.souza@bandtec.com.br',
        HASHBYTES('MD5', 'ExSenha1')
    ),
    (
        'Joao Pedro Oliveira',
        'joao.soliveira@bandtec.com.br',
        HASHBYTES('MD5', 'ExSenha1')
    ),
    (
        'Lucas Teixeira',
        'lucas.teixeira@bandtec.com.br',
        HASHBYTES('MD5', 'ExSenha1')
    ),
    (
        'Lucas Mesquita',
        'lucas.msouza@bandtec.com.br',
        HASHBYTES('MD5', 'ExSenha3')
    ),
    (
        'Nikolas Virionis',
        'nikolas.virionis@bandtec.com.br',
        HASHBYTES('MD5', 'ExSenha1')
    );

INSERT INTO
    empresa(id_empresa, nome, cidade, pais, fk_staff)
VALUES
    (
        '203783731',
        'NYSE MARKET, INC',
        'New York, NY',
        'United States',
        6
    ),
    (
        '09.346.601/0001-25',
        'B3',
        'São Paulo, SP',
        'Brasil',
        2
    );

INSERT INTO
    usuario(
        nome,
        email,
        senha,
        cargo,
        token,
        fk_empresa,
        fk_supervisor
    )
VALUES
    (
        'Lucas M Souza',
        'lucas.msouza@outlook.com',
        HASHBYTES('MD5', 'ExSenha1'),
        'admin',
        'abnanvf5abnanvf5',
        '203783731',
        NULL
    ),
    (
        'Teixeira Lucas',
        'teixeiralucas793@gmail.com',
        HASHBYTES('MD5', 'ExSenha1'),
        'admin',
        'arblvsfaarblvsfa',
        '09.346.601/0001-25',
        NULL
    ),
    (
        'Lucas Mesquita',
        'lucasmesquita58@hotmail.com',
        HASHBYTES('MD5', 'ExSenha1'),
        'gestor',
        'z4d62p9xz4d62p9x',
        '09.346.601/0001-25',
        2
    ),
    (
        'Nikolas Virionis',
        'nickkolas.nickk@gmail.com',
        HASHBYTES('MD5', 'ExSenha1'),
        'gestor',
        'k8xd9pysk8xd9pys',
        '203783731',
        1
    ),
    (
        'Amanda Caramico',
        'amanda@caramico.com.br',
        HASHBYTES('MD5', 'ExSenha1'),
        'gestor',
        '9katbzd79katbzd7',
        '203783731',
        1
    ),
    (
        'Lucas Mesquita',
        'lmesquita466@gmail.com',
        HASHBYTES('MD5', 'ExSenha1'),
        'analista',
        'd64h81abd64h81ab',
        '09.346.601/0001-25',
        3
    ),
    (
        'Lucas M. Teixeira',
        'lucasmteixeira793@gmail.com',
        HASHBYTES('MD5', 'ExSenha1'),
        'analista',
        'gcmjx9u3gcmjx9u3',
        '203783731',
        3
    ),
    (
        'Lucas Teixeira',
        'teixeiralucas793@outlook.com',
        HASHBYTES('MD5', 'ExSenha1'),
        'analista',
        'agdjkvxwagdjkvxw',
        '09.346.601/0001-25',
        4
    ),
    (
        'Amanda F Caramico',
        'amandafcaramico@hotmail.com',
        HASHBYTES('MD5', 'ExSenha1'),
        'analista',
        'j2akj5pvj2akj5pv',
        '203783731',
        4
    ),
    (
        'Felipe Cruz',
        'fc2369474@gmail.com',
        HASHBYTES('MD5', 'ExSenha1'),
        'analista',
        'bet0g4wcbet0g4wc',
        '09.346.601/0001-25',
        5
    ),
    (
        'Pedro Santos Oliveira',
        'jpso0907@gmail.com',
        HASHBYTES('MD5', 'ExSenha1'),
        'analista',
        'mc4y8gawmc4y8gaw',
        '203783731',
        5
    );

INSERT INTO
    contato(fk_usuario, id_contato, valor, fk_forma_contato)
VALUES
    (1, 1, '2568647004', 1),
    (2, 1, '2435716496', 1),
    (3, 1, '9737304111', 1),
    (3, 2, 'amanda@caramico.com.br', 3),
    (4, 1, '2435716496', 1),
    (4, 2, 'nikolas.virionis@gmail.com', 3),
    (5, 1, '2565025835', 1),
    (5, 2, 'lucasmesquita58@hotmail.com', 3),
    (6, 1, '4786956231', 1),
    (6, 2, '4786956231', 2),
    (7, 1, 'lucasmteixeira793@gmail.com', 3),
    (8, 1, '2430765871', 1),
    (8, 2, '2430765871', 2),
    (8, 3, 'teixeiralucas793@outlook.com', 3),
    (9, 1, '8018369067', 1),
    (9, 2, '8018369067', 2),
    (9, 3, 'amandafcaramico@hotmail.com', 3),
    (10, 1, '3180422529', 1),
    (11, 1, '8305786042', 1),
    (11, 2, '8305786042', 2),
    (11, 3, 'jpso0907@gmail.com', 3);

INSERT INTO
    maquina(id_maquina, nome, senha, fk_empresa)
VALUES
    (
        '73:04:cd:e5:6f:a0',
        'Server1',
        HASHBYTES('MD5', 'ExSenha1'),
        '203783731'
    ),
    (
        '2f:d0:bb:62:61:14',
        'Server2',
        HASHBYTES('MD5', 'ExSenha1'),
        '203783731'
    ),
    (
        'a3:4e:5e:38:96:be',
        'Server3',
        HASHBYTES('MD5', 'ExSenha1'),
        '203783731'
    ),
    (
        '7b:a0:1d:74:7f:68',
        'Server4',
        HASHBYTES('MD5', 'ExSenha1'),
        '203783731'
    ),
    (
        '87:6d:74:ea:b8:d6',
        'Servidor1',
        HASHBYTES('MD5', 'ExSenha1'),
        '09.346.601/0001-25'
    ),
    (
        '03:db:e0:03:dd:f2',
        'Servidor2',
        HASHBYTES('MD5', 'ExSenha1'),
        '09.346.601/0001-25'
    );

INSERT INTO
    usuario_maquina(responsavel, fk_usuario, fk_maquina)
VALUES
    ('s', 7, 1),
    ('n', 11, 1),
    ('n', 9, 2),
    ('s', 6, 2),
    ('n', 7, 3),
    ('s', 9, 3),
    ('s', 11, 4),
    ('n', 6, 4),
    ('n', 8, 5),
    ('s', 10, 5),
    ('n', 10, 6),
    ('s', 8, 6);

INSERT INTO
    categoria_medicao(medicao_limite, fk_maquina, fk_tipo_medicao)
VALUES
    (60, 1, 1),
    (115, 1, 2),
    (70, 1, 3),
    (80, 1, 4),
    (0.9, 1, 5),
    (80, 1, 6),
    (100, 1, 7),
    (60, 2, 1),
    (115, 2, 2),
    (70, 2, 3),
    (80, 2, 4),
    (0.9, 2, 5),
    (80, 2, 6),
    (100, 2, 7),
    (60, 3, 1),
    (115, 3, 2),
    (70, 3, 3),
    (80, 3, 4),
    (0.9, 3, 5),
    (80, 3, 6),
    (100, 3, 7),
    (60, 4, 1),
    (115, 4, 2),
    (70, 4, 3),
    (80, 4, 4),
    (0.9, 4, 5),
    (80, 4, 6),
    (100, 4, 7),
    (60, 5, 1),
    (115, 5, 2),
    (70, 5, 3),
    (80, 5, 4),
    (0.9, 5, 5),
    (80, 5, 6),
    (100, 5, 7),
    (60, 6, 1),
    (115, 6, 2),
    (70, 6, 3),
    (80, 6, 4),
    (0.9, 6, 5),
    (80, 6, 6),
    (100, 6, 7);