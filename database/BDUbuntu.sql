DROP DATABASE safelog;

CREATE DATABASE safelog;

USE safelog;

CREATE TABLE staff (
    id_staff int PRIMARY KEY AUTO_INCREMENT,
    nome varchar(60) NOT NULL,
    email varchar(60) NOT NULL UNIQUE,
    senha char(32) NOT NULL,
    token char(16)
);

CREATE TABLE empresa (
    id_empresa varchar(30) PRIMARY KEY,
    nome varchar(60) NOT NULL,
    pais varchar(50) NOT NULL,
    cidade varchar(50) NOT NULL,
    fk_staff int NOT NULL,
    FOREIGN KEY(fk_staff) REFERENCES staff(id_staff)
);

CREATE TABLE usuario (
    id_usuario int PRIMARY KEY AUTO_INCREMENT,
    nome varchar(60),
    email varchar(60) NOT NULL UNIQUE,
    senha char(32),
    cargo enum('admin', 'gestor', 'analista'),
    token char(16),
    fk_empresa varchar(30) NOT NULL,
    fk_supervisor int,
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
    FOREIGN KEY (fk_supervisor) REFERENCES usuario(id_usuario)
);

CREATE TABLE maquina (
    pk_maquina int AUTO_INCREMENT PRIMARY KEY,
    id_maquina varchar(20) UNIQUE NOT NULL,
    nome varchar(60) NOT NULL,
    senha char(32) NOT NULL,
    fk_empresa varchar(30) NOT NULL,
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);

CREATE TABLE usuario_maquina (
    id_usuario_maquina int AUTO_INCREMENT PRIMARY KEY,
    responsavel enum('s', 'n'),
    fk_usuario int NOT NULL,
    fk_maquina int NOT NULL,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_maquina) REFERENCES maquina(pk_maquina)
);

CREATE TABLE tipo_medicao (
    id_tipo_medicao int PRIMARY KEY AUTO_INCREMENT,
    tipo varchar(45),
    unidade varchar(7)
);

CREATE TABLE categoria_medicao (
    id_categoria_medicao int PRIMARY KEY AUTO_INCREMENT,
    medicao_limite decimal(6, 2),
    fk_maquina int NOT NULL,
    fk_tipo_medicao int,
    FOREIGN KEY (fk_maquina) REFERENCES maquina(pk_maquina),
    FOREIGN KEY (fk_tipo_medicao) REFERENCES tipo_medicao(id_tipo_medicao)
);

CREATE TABLE medicao (
    id_medicao INT PRIMARY KEY AUTO_INCREMENT,
    valor decimal(7, 2),
    tipo ENUM('normal', 'risco', 'critico'),
    data_medicao DATETIME,
    fk_categoria_medicao INT,
    FOREIGN KEY (fk_categoria_medicao) REFERENCES categoria_medicao (id_categoria_medicao)
);

INSERT INTO
    tipo_medicao
VALUES
    (NULL, 'cpu_temperatura', '°C'),
    (NULL, 'cpu_frequencia', '%'),
    (NULL, 'cpu_porcentagem', '%'),
    (NULL, 'ram_porcentagem', '%'),
    (NULL, 'ram_livre', 'Gb'),
    (NULL, 'disco_porcentagem', '%'),
    (NULL, 'disco_livre', 'Gb');

INSERT INTO
    staff
VALUES
    (
        NULL,
        'Amanda Caramico',
        'amanda.caramico@bandtec.com.br',
        MD5('ExSenha1'),
        NULL
    );

INSERT INTO
    empresa
VALUES
    (
        '00.000.000/0000-00',
        'SafeLog',
        'São Paulo, SP',
        'Brasil',
        1
    );

INSERT INTO
    usuario
VALUES
    (
        NULL,
        'Lucas Mesquita',
        'lucas.msouza@bandtec.com.br',
        MD5('ExSenha1'),
        'admin',
        'abnanvf5abnanvf5',
        '00.000.000/0000-00',
        NULL
    ),
    (
        NULL,
        'Nikolas Virionis',
        'nikolas.virionis@bandtec.com.br',
        MD5('ExSenha1'),
        'gestor',
        'skcmqdixskcmqdix',
        '00.000.000/0000-00',
        1
    ),
    (
        NULL,
        'Lucas Teixeira',
        'lucas.teixeira@bandtec.com.br',
        MD5('ExSenha1'),
        'analista',
        'k8xd9pysk8xd9pys',
        '00.000.000/0000-00',
        2
    );

INSERT INTO
    maquina(id_maquina, nome, senha, fk_empresa)
VALUES
    (
        '12:91:82:67:d1:e5',
        'EC2 - SAFELOG',
        MD5('ExSenha1'),
        '00.000.000/0000-00'
    );

INSERT INTO
    usuario_maquina
VALUES
    (NULL, 's', 3, 1);

INSERT INTO
    categoria_medicao
VALUES
    (NULL, 60, 1, 1),
    (NULL, 115, 1, 2),
    (NULL, 70, 1, 3),
    (NULL, 80, 1, 4),
    (NULL, 0.9, 1, 5),
    (NULL, 80, 1, 6),
    (NULL, 100, 1, 7);