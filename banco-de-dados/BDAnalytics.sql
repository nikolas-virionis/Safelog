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

CREATE TABLE analytics (
    id_dado int PRIMARY KEY AUTO_INCREMENT,
    cpu decimal(5, 2),
    ram decimal(5, 2),
    disco decimal(5, 2),
    data_medicao datetime,
    fk_maquina varchar(20),
    FOREIGN KEY (fk_maquina) REFERENCES maquina(id_maquina)
);