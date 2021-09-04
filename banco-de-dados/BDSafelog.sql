CREATE DATABASE safelog;

CREATE TABLE staff (
    id_staff int PRIMARY KEY AUTO_INCREMENT,
    nome varchar(60),
    email varchar(60),
    senha varchar(20)
);

CREATE TABLE empresa (
    id_empresa varchar(30) PRIMARY KEY,
    nome varchar(60),
    país varchar(50),
    cidade varchar(50),
    fk_staff int,
    FOREIGN KEY(fk_staff) REFERENCES staff(id_staff)
);

CREATE TABLE usuario (
    id_usuario char(8) PRIMARY KEY,
    nome varchar(60),
    email varchar(60),
    senha varchar (20),
    cargo enum('admin', 'gestor', 'operador'),
    fk_empresa varchar(30),
    fk_supervisor char(8),
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
    FOREIGN KEY (fk_supervisor) REFERENCES usuario(id_usuario)
);

CREATE TABLE forma_contato (
    id_forma_contato int PRIMARY KEY AUTO_INCREMENT,
    nome varchar(45)
);

CREATE TABLE contato (
    fk_usuario char(8),
    id_contato int,
    valor varchar(80),
    fk_forma_contato int,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_forma_contato) REFERENCES forma_contato(id_forma_contato),
    PRIMARY KEY (fk_usuario, id_contato)
);

CREATE TABLE maquina (
    id_maquina varchar(20),
    nome varchar(60),
    fk_empresa varchar(30),
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);

CREATE TABLE usuario_maquina (
    id_usuario_maquina int AUTO_INCREMENT PRIMARY KEY,
    fk_usuario char(8),
    fk_maquina varchar(20),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_maquina) REFERENCES usuario(id_maquina),
);

CREATE TABLE componente (
    id_componente int PRIMARY KEY AUTO_INCREMENT,
    tipo varchar(45)
);

CREATE TABLE tipo_medicao (
    fk_componente int,
    id_tipo_medicao int,
    tipo varchar(45),
    FOREIGN KEY (fk_componente) REFERENCES componente (id_componente),
    PRIMARY KEY (fk_componente, id_tipo_medicao)
);

CREATE TABLE categoria_medicao (
    id_categoria_medicao int PRIMARY KEY AUTO_INCREMENT,
    medicao_limite varchar(10),
    fk_maquina varchar(20),
    fk_componente int,
    fk_tipo_medicao int,
    FOREIGN KEY (fk_maquina) REFERENCES usuario(id_maquina),
    FOREIGN KEY (fk_componente) REFERENCES componente (id_componente),
    FOREIGN KEY (fk_tipo_medicao) REFERENCES tipo_medicao(id_tipo_medicao)
);

CREATE TABLE medicao (
    id_medicao int PRIMARY KEY AUTO_INCREMENT,
    valor varchar(12),
    tipo enum('normal', 'risco', 'critico'),
    data_medicao datetime,
    fk_categoria_medicao int,
    FOREIGN KEY (fk_categoria_medicao) REFERENCES categoria_medicao(id_categoria_medicao)
);

-- passível a escalabilidade de componentes e tipos de medição
-- INSERT INTO
--     componente
-- VALUES
--     (NULL, 'cpu'),
--     (NULL, 'ram'),
--     (NULL, 'disco');
-- INSERT INTO
--     tipo_medicao
-- VALUES
--     (1, 1, 'temperatura'),
--     (1, 2, 'frequencia'),
--     (1, 3, 'porcentagem'),
--     (1, 4, 'livre'),
--     (2, 1, 'porcentagem'),
--     (2, 2, 'livre'),
--     (3, 1, 'porcentagem'),
--     (3, 2, 'livre');
-- INSERT INTO
--     forma_contato
-- VALUES
--     (NULL, 'whatsapp'),
--     (NULL, 'telegram'),
--     (NULL, 'slack');