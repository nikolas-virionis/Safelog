DROP DATABASE safelog;

CREATE DATABASE safelog;

USE safelog;

CREATE TABLE staff (
    id_staff int PRIMARY KEY AUTO_INCREMENT,
    nome varchar(60) NOT NULL,
    email varchar(60) NOT NULL UNIQUE,
    senha char(32) NOT NULL
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

CREATE TABLE forma_contato (
    id_forma_contato int PRIMARY KEY AUTO_INCREMENT,
    nome varchar(45)
);

CREATE TABLE contato (
    fk_usuario int,
    id_contato int,
    valor varchar(80),
    fk_forma_contato int,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_forma_contato) REFERENCES forma_contato(id_forma_contato),
    PRIMARY KEY (fk_usuario, id_contato)
);

CREATE TABLE maquina (
    id_maquina varchar(20) PRIMARY KEY,
    nome varchar(60) NOT NULL,
    senha char(32) NOT NULL,
    fk_empresa varchar(30) NOT NULL,
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);

CREATE TABLE usuario_maquina (
    id_usuario_maquina int AUTO_INCREMENT PRIMARY KEY,
    responsavel enum('s', 'n'),
    fk_usuario int NOT NULL,
    fk_maquina varchar(20) NOT NULL,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_maquina) REFERENCES maquina(id_maquina)
);

CREATE TABLE tipo_medicao (
    id_tipo_medicao int PRIMARY KEY AUTO_INCREMENT,
    tipo varchar(45),
    unidade varchar(7)
);

CREATE TABLE categoria_medicao (
    id_categoria_medicao int PRIMARY KEY AUTO_INCREMENT,
    medicao_limite decimal(6, 2),
    fk_maquina varchar(20),
    fk_tipo_medicao int,
    FOREIGN KEY (fk_maquina) REFERENCES maquina(id_maquina),
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

CREATE TABLE maquina_analytics (
    id_maquina_analytics int PRIMARY KEY AUTO_INCREMENT,
    limite_cpu decimal(5, 2),
    limite_ram decimal(5, 2),
    limite_disco decimal(5, 2),
    fk_maquina varchar(20),
    FOREIGN KEY (fk_maquina) REFERENCES maquina(id_maquina)
);

CREATE TABLE analytics (
    id_analytics int PRIMARY KEY AUTO_INCREMENT,
    cpu decimal(5, 2),
    ram decimal(5, 2),
    disco decimal(5, 2),
    data_medicao datetime,
    fk_maquina_analytics int,
    FOREIGN KEY (fk_maquina_analytics) REFERENCES maquina_analytics(id_maquina_analytics)
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
    forma_contato
VALUES
    (NULL, 'whatsapp'),
    (NULL, 'telegram'),
    (NULL, 'slack');

INSERT INTO
    staff
VALUES
    (
        NULL,
        'Amanda Caramico',
        'amanda.caramico@bandtec.com.br',
        MD5('ExSenha1')
    ),
    (
        NULL,
        'Felipe Cruz',
        'felipe.souza@bandtec.com.br',
        MD5('ExSenha1')
    ),
    (
        NULL,
        'João Pedro Oliveira',
        'joao.soliveira@bandtec.com.br',
        MD5('ExSenha1')
    ),
    (
        NULL,
        'Lucas Teixeira',
        'lucas.teixeira@bandtec.com.br',
        MD5('ExSenha1')
    ),
    (
        NULL,
        'Lucas Mesquita',
        'lucas.msouza@bandtec.com.br',
        MD5('ExSenha3')
    ),
    (
        NULL,
        'Nikolas Virionis',
        'nikolas.virionis@bandtec.com.br',
        MD5('ExSenha1')
    );

INSERT INTO
    empresa
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
    usuario
VALUES
    (
        NULL,
        'Jeffrey Sprecher',
        'jeffrey.sprecher@gmail.com',
        MD5('ExSenha1'),
        'admin',
        'abnanvf5abnanvf5',
        '203783731',
        NULL
    ),
    (
        NULL,
        'Gilson Finkelsztain',
        'gilson.finkelsztain@gmail.com',
        MD5('ExSenha1'),
        'admin',
        'arblvsfaarblvsfa',
        '09.346.601/0001-25',
        NULL
    ),
    (
        NULL,
        'Raymond E. Miller',
        'raymond.miller@gmail.com',
        MD5('ExSenha1'),
        'gestor',
        '9katbzd79katbzd7',
        '203783731',
        1
    ),
    (
        NULL,
        'Kauã Rodrigues Pinto',
        'kaua.rodrigues@gmail.com',
        MD5('ExSenha1'),
        'gestor',
        'skcmqdixskcmqdix',
        '09.346.601/0001-25',
        2
    ),
    (
        NULL,
        'Andrew K. Hutson',
        'andrew.hutson@gmail.com',
        MD5('ExSenha1'),
        'gestor',
        'k8xd9pysk8xd9pys',
        '203783731',
        1
    ),
    (
        NULL,
        'Julia Ferreira Pinto',
        'julia.ferreira@gmail.com',
        MD5('ExSenha1'),
        'gestor',
        'z4d62p9xz4d62p9x',
        '09.346.601/0001-25',
        2
    ),
    (
        NULL,
        'Harvey M. Knudsen',
        'harvey.knudsen@gmail.com',
        MD5('ExSenha1'),
        'analista',
        'f3edujdqf3edujdq',
        '203783731',
        3
    ),
    (
        NULL,
        'Eduardo Pereira Azevedo',
        'eduardo.azevedo@gmail.com',
        MD5('ExSenha1'),
        'analista',
        'd64h81abd64h81ab',
        '09.346.601/0001-25',
        4
    ),
    (
        NULL,
        'Laura E. Meade',
        'laura.meade@gmail.com',
        MD5('ExSenha1'),
        'analista',
        'gcmjx9u3gcmjx9u3',
        '203783731',
        3
    ),
    (
        NULL,
        'Douglas Sousa Dias',
        'douglas.dias@gmail.com',
        MD5('ExSenha1'),
        'analista',
        'agdjkvxwagdjkvxw',
        '09.346.601/0001-25',
        4
    ),
    (
        NULL,
        'Pamela T. Lennox',
        'pamela.lennox@gmail.com',
        MD5('ExSenha1'),
        'analista',
        'j2akj5pvj2akj5pv',
        '203783731',
        5
    ),
    (
        NULL,
        'Júlio Sousa Azevedo',
        'julio.azevedo@gmail.com',
        MD5('ExSenha1'),
        'analista',
        'bet0g4wcbet0g4wc',
        '09.346.601/0001-25',
        6
    ),
    (
        NULL,
        'Susan K. Adams',
        'susan.adams@gmail.com',
        MD5('ExSenha1'),
        'analista',
        'mc4y8gawmc4y8gaw',
        '203783731',
        5
    ),
    (
        NULL,
        'Nicole Silva Gomes',
        'nicole.gomes@gmail.com',
        MD5('ExSenha1'),
        'analista',
        '3pta7uqx3pta7uqx',
        '09.346.601/0001-25',
        6
    );

INSERT INTO
    contato
VALUES
    (1, 1, '2568647004', 1),
    (2, 1, '2435716496', 1),
    (3, 1, '9737304111', 1),
    (3, 2, 'raymond.miller@gmail.com', 3),
    (4, 1, '2435716496', 1),
    (4, 2, 'kaua.rodrigues@gmail.com', 3),
    (5, 1, '2565025835', 1),
    (5, 2, 'andrew.hutson@gmail.com', 3),
    (6, 1, '4786956231', 1),
    (6, 2, '4786956231', 2),
    (7, 1, 'harvey.knudsen@gmail.com', 3),
    (8, 1, '2430765871', 1),
    (8, 2, '2430765871', 2),
    (8, 3, 'eduardo.azevedo@gmail.com', 3),
    (9, 1, '8018369067', 1),
    (9, 2, '8018369067', 2),
    (9, 3, 'laura.meade@gmail.com', 3),
    (10, 1, '3180422529', 1),
    (11, 1, '8305786042', 1),
    (11, 2, '8305786042', 2),
    (11, 3, 'pamela.lennox@gmail.com', 3),
    (12, 1, '1137503889', 1),
    (12, 2, '1137503889', 2),
    (12, 3, 'julio.azevedo@gmail.com', 3),
    (13, 1, '7064230183', 1),
    (13, 2, '7064230183', 2),
    (13, 3, 'susan.adams@gmail.com', 3),
    (14, 1, '4748883483', 1),
    (14, 2, '4748883483', 2),
    (14, 3, 'nicole.gomes@gmail.com', 3);

INSERT INTO
    maquina
VALUES
    (
        '73-04-cd-e5-6f-a0',
        'Server1',
        MD5('ExSenha1'),
        '203783731'
    ),
    (
        '2f-d0-bb-62-61-14',
        'Server2',
        MD5('ExSenha1'),
        '203783731'
    ),
    (
        'a3-4e-5e-38-96-be',
        'Server3',
        MD5('ExSenha1'),
        '203783731'
    ),
    (
        '7b-a0-1d-74-7f-68',
        'Server4',
        MD5('ExSenha1'),
        '203783731'
    ),
    (
        '87-6d-74-ea-b8-d6',
        'Servidor1',
        MD5('ExSenha1'),
        '09.346.601/0001-25'
    ),
    (
        '03-db-e0-03-dd-f2',
        'Servidor2',
        MD5('ExSenha1'),
        '09.346.601/0001-25'
    ),
    (
        '67-8f-75-1a-a2-e0',
        'Servidor3',
        MD5('ExSenha1'),
        '09.346.601/0001-25'
    ),
    (
        '87-f4-a2-f4-26-7f',
        'Servidor4',
        MD5('ExSenha1'),
        '09.346.601/0001-25'
    );

INSERT INTO
    usuario_maquina
VALUES
    (NULL, 's', 7, '73-04-cd-e5-6f-a0'),
    (NULL, 'n', 11, '73-04-cd-e5-6f-a0'),
    (NULL, 'n', 9, '2f-d0-bb-62-61-14'),
    (NULL, 's', 13, '2f-d0-bb-62-61-14'),
    (NULL, 'n', 7, 'a3-4e-5e-38-96-be'),
    (NULL, 's', 9, 'a3-4e-5e-38-96-be'),
    (NULL, 's', 11, '7b-a0-1d-74-7f-68'),
    (NULL, 'n', 13, '7b-a0-1d-74-7f-68'),
    (NULL, 's', 8, '87-6d-74-ea-b8-d6'),
    (NULL, 'n', 12, '87-6d-74-ea-b8-d6'),
    (NULL, 'n', 10, '03-db-e0-03-dd-f2'),
    (NULL, 's', 14, '03-db-e0-03-dd-f2'),
    (NULL, 'n', 8, '67-8f-75-1a-a2-e0'),
    (NULL, 's', 10, '67-8f-75-1a-a2-e0'),
    (NULL, 's', 12, '87-f4-a2-f4-26-7f'),
    (NULL, 'n', 14, '87-f4-a2-f4-26-7f');

INSERT INTO
    categoria_medicao
VALUES
    (NULL, 60, '73-04-cd-e5-6f-a0', 1),
    (NULL, 115, '73-04-cd-e5-6f-a0', 2),
    (NULL, 70, '73-04-cd-e5-6f-a0', 3),
    (NULL, 80, '73-04-cd-e5-6f-a0', 4),
    (NULL, 0.9, '73-04-cd-e5-6f-a0', 5),
    (NULL, 80, '73-04-cd-e5-6f-a0', 6),
    (NULL, 100, '73-04-cd-e5-6f-a0', 7),
    (NULL, 60, '2f-d0-bb-62-61-14', 1),
    (NULL, 115, '2f-d0-bb-62-61-14', 2),
    (NULL, 70, '2f-d0-bb-62-61-14', 3),
    (NULL, 80, '2f-d0-bb-62-61-14', 4),
    (NULL, 0.9, '2f-d0-bb-62-61-14', 5),
    (NULL, 80, '2f-d0-bb-62-61-14', 6),
    (NULL, 100, '2f-d0-bb-62-61-14', 7),
    (NULL, 60, 'a3-4e-5e-38-96-be', 1),
    (NULL, 115, 'a3-4e-5e-38-96-be', 2),
    (NULL, 70, 'a3-4e-5e-38-96-be', 3),
    (NULL, 80, 'a3-4e-5e-38-96-be', 4),
    (NULL, 0.9, 'a3-4e-5e-38-96-be', 5),
    (NULL, 80, 'a3-4e-5e-38-96-be', 6),
    (NULL, 100, 'a3-4e-5e-38-96-be', 7),
    (NULL, 60, '7b-a0-1d-74-7f-68', 1),
    (NULL, 115, '7b-a0-1d-74-7f-68', 2),
    (NULL, 70, '7b-a0-1d-74-7f-68', 3),
    (NULL, 80, '7b-a0-1d-74-7f-68', 4),
    (NULL, 0.9, '7b-a0-1d-74-7f-68', 5),
    (NULL, 80, '7b-a0-1d-74-7f-68', 6),
    (NULL, 100, '7b-a0-1d-74-7f-68', 7),
    (NULL, 60, '87-6d-74-ea-b8-d6', 1),
    (NULL, 115, '87-6d-74-ea-b8-d6', 2),
    (NULL, 70, '87-6d-74-ea-b8-d6', 3),
    (NULL, 80, '87-6d-74-ea-b8-d6', 4),
    (NULL, 0.9, '87-6d-74-ea-b8-d6', 5),
    (NULL, 80, '87-6d-74-ea-b8-d6', 6),
    (NULL, 100, '87-6d-74-ea-b8-d6', 7),
    (NULL, 60, '03-db-e0-03-dd-f2', 1),
    (NULL, 115, '03-db-e0-03-dd-f2', 2),
    (NULL, 70, '03-db-e0-03-dd-f2', 3),
    (NULL, 80, '03-db-e0-03-dd-f2', 4),
    (NULL, 0.9, '03-db-e0-03-dd-f2', 5),
    (NULL, 80, '03-db-e0-03-dd-f2', 6),
    (NULL, 100, '03-db-e0-03-dd-f2', 7),
    (NULL, 60, '67-8f-75-1a-a2-e0', 1),
    (NULL, 115, '67-8f-75-1a-a2-e0', 2),
    (NULL, 70, '67-8f-75-1a-a2-e0', 3),
    (NULL, 80, '67-8f-75-1a-a2-e0', 4),
    (NULL, 0.9, '67-8f-75-1a-a2-e0', 5),
    (NULL, 80, '67-8f-75-1a-a2-e0', 6),
    (NULL, 100, '67-8f-75-1a-a2-e0', 7),
    (NULL, 60, '87-f4-a2-f4-26-7f', 1),
    (NULL, 115, '87-f4-a2-f4-26-7f', 2),
    (NULL, 70, '87-f4-a2-f4-26-7f', 3),
    (NULL, 80, '87-f4-a2-f4-26-7f', 4),
    (NULL, 0.9, '87-f4-a2-f4-26-7f', 5),
    (NULL, 80, '87-f4-a2-f4-26-7f', 6),
    (NULL, 100, '87-f4-a2-f4-26-7f', 7);

INSERT INTO
    maquina_analytics
VALUES
    (NULL, 85, 60, 73, '73-04-cd-e5-6f-a0'),
    (NULL, 90, 89, 68, '2f-d0-bb-62-61-14'),
    (NULL, 74, 83, 83, 'a3-4e-5e-38-96-be'),
    (NULL, 86, 68, 55, '7b-a0-1d-74-7f-68'),
    (NULL, 95, 80, 85, '87-6d-74-ea-b8-d6'),
    (NULL, 70, 60, 52, '03-db-e0-03-dd-f2'),
    (NULL, 81, 59, 81, '67-8f-75-1a-a2-e0'),
    (NULL, 87, 85, 90, '87-f4-a2-f4-26-7f');

INSERT INTO
    analytics
VALUES
    (
        NULL,
        58.0,
        89.0,
        74.3,
        NOW(),
        1
    ),
    (NULL, 19.5, 13.9, 7.3, NOW(), 2),
    (
        NULL,
        23.8,
        14.5,
        85.2,
        NOW(),
        3
    ),
    (NULL, 3.8, 8.6, 48.7, NOW(), 4),
    (
        NULL,
        85.3,
        65.4,
        68.4,
        NOW(),
        5
    ),
    (
        NULL,
        59.2,
        47.9,
        74.1,
        NOW(),
        6
    ),
    (NULL, 79.5, 9.7, 43.4, NOW(), 7),
    (
        NULL,
        72.1,
        69.3,
        87.9,
        NOW(),
        8
    ),
    (
        NULL,
        60.0,
        78.0,
        74.3,
        NOW(),
        1
    ),
    (
        NULL,
        26.5,
        28.3,
        10.4,
        NOW(),
        2
    ),
    (
        NULL,
        19.8,
        12.5,
        85.2,
        NOW(),
        3
    ),
    (NULL, 5, 12, 50.0, NOW(), 4),
    (NULL, 90, 63, 69, NOW(), 5),
    (NULL, 60, 45, 75, NOW(), 6),
    (NULL, 80, 15, 36.4, NOW(), 7),
    (
        NULL,
        72.1,
        69.3,
        87.9,
        NOW(),
        8
    ),
    (
        NULL,
        35.0,
        91.0,
        70.3,
        NOW(),
        1
    ),
    (NULL, 46.5, 9.9, 17.3, NOW(), 2),
    (
        NULL,
        18.8,
        19.5,
        85.2,
        NOW(),
        3
    ),
    (NULL, 2, 6, 48, NOW(), 4),
    (NULL, 92, 65.4, 69.4, NOW(), 5),
    (
        NULL,
        49.2,
        47.9,
        74.1,
        NOW(),
        6
    ),
    (NULL, 69.5, 11, 40.4, NOW(), 7),
    (NULL, 82.1, 80.3, 85, NOW(), 8),
    (
        NULL,
        45.0,
        77.0,
        69.3,
        NOW(),
        1
    ),
    (NULL, 33.5, 15, 18, NOW(), 2),
    (
        NULL,
        18.8,
        23.5,
        84.2,
        NOW(),
        3
    ),
    (NULL, 9, 6, 49, NOW(), 4),
    (NULL, 81, 65.4, 66.4, NOW(), 5),
    (
        NULL,
        38.2,
        47.9,
        72.1,
        NOW(),
        6
    ),
    (NULL, 78.5, 11, 40.4, NOW(), 7),
    (NULL, 88.1, 80.3, 85, NOW(), 8),
    (
        NULL,
        58.0,
        89.0,
        74.3,
        NOW(),
        1
    ),
    (NULL, 19.5, 13.9, 7.3, NOW(), 2),
    (
        NULL,
        23.8,
        14.5,
        85.2,
        NOW(),
        3
    ),
    (NULL, 3.8, 8.6, 48.7, NOW(), 4),
    (
        NULL,
        85.3,
        65.4,
        68.4,
        NOW(),
        5
    ),
    (
        NULL,
        59.2,
        47.9,
        74.1,
        NOW(),
        6
    ),
    (NULL, 79.5, 9.7, 43.4, NOW(), 7),
    (
        NULL,
        72.1,
        69.3,
        87.9,
        NOW(),
        8
    ),
    (
        NULL,
        60.0,
        78.0,
        74.3,
        NOW(),
        1
    ),
    (
        NULL,
        26.5,
        28.3,
        10.4,
        NOW(),
        2
    ),
    (
        NULL,
        19.8,
        12.5,
        85.2,
        NOW(),
        3
    ),
    (NULL, 5, 12, 50.0, NOW(), 4),
    (NULL, 90, 63, 69, NOW(), 5),
    (NULL, 60, 45, 75, NOW(), 6),
    (NULL, 80, 15, 36.4, NOW(), 7),
    (
        NULL,
        72.1,
        69.3,
        87.9,
        NOW(),
        8
    ),
    (
        NULL,
        35.0,
        91.0,
        70.3,
        NOW(),
        1
    ),
    (NULL, 46.5, 9.9, 17.3, NOW(), 2),
    (
        NULL,
        18.8,
        19.5,
        85.2,
        NOW(),
        3
    ),
    (NULL, 2, 6, 48, NOW(), 4),
    (NULL, 92, 65.4, 69.4, NOW(), 5),
    (
        NULL,
        49.2,
        47.9,
        74.1,
        NOW(),
        6
    ),
    (NULL, 69.5, 11, 40.4, NOW(), 7),
    (NULL, 82.1, 80.3, 85, NOW(), 8),
    (
        NULL,
        45.0,
        77.0,
        69.3,
        NOW(),
        1
    ),
    (NULL, 33.5, 15, 18, NOW(), 2),
    (
        NULL,
        18.8,
        23.5,
        84.2,
        NOW(),
        3
    ),
    (NULL, 9, 6, 49, NOW(), 4),
    (NULL, 81, 65.4, 66.4, NOW(), 5),
    (
        NULL,
        38.2,
        47.9,
        72.1,
        NOW(),
        6
    ),
    (NULL, 78.5, 11, 40.4, NOW(), 7),
    (NULL, 88.1, 80.3, 85, NOW(), 8),
    (
        NULL,
        58.0,
        89.0,
        74.3,
        NOW(),
        1
    ),
    (NULL, 19.5, 13.9, 7.3, NOW(), 2),
    (
        NULL,
        23.8,
        14.5,
        85.2,
        NOW(),
        3
    ),
    (NULL, 3.8, 8.6, 48.7, NOW(), 4),
    (
        NULL,
        85.3,
        65.4,
        68.4,
        NOW(),
        5
    ),
    (
        NULL,
        59.2,
        47.9,
        74.1,
        NOW(),
        6
    ),
    (NULL, 79.5, 9.7, 43.4, NOW(), 7),
    (
        NULL,
        72.1,
        69.3,
        87.9,
        NOW(),
        8
    ),
    (
        NULL,
        60.0,
        78.0,
        74.3,
        NOW(),
        1
    ),
    (
        NULL,
        26.5,
        28.3,
        10.4,
        NOW(),
        2
    ),
    (
        NULL,
        19.8,
        12.5,
        85.2,
        NOW(),
        3
    ),
    (NULL, 5, 12, 50.0, NOW(), 4),
    (NULL, 90, 63, 69, NOW(), 5),
    (NULL, 60, 45, 75, NOW(), 6),
    (NULL, 80, 15, 36.4, NOW(), 7),
    (NULL, 72.1, 69.3, 87.9, NOW(), 8);

DO SLEEP(5);

INSERT INTO
    medicao
VALUES
    (NULL, 50, 'normal', NOW(), 1),
    (NULL, 100, 'normal', NOW(), 2),
    (NULL, 60, 'normal', NOW(), 3),
    (NULL, 75, 'normal', NOW(), 4),
    (NULL, 1, 'normal', NOW(), 5),
    (NULL, 75, 'normal', NOW(), 6),
    (NULL, 120, 'normal', NOW(), 7),
    (NULL, 65, 'risco', NOW(), 8),
    (NULL, 120, 'risco', NOW(), 9),
    (NULL, 80, 'risco', NOW(), 10),
    (NULL, 85, 'risco', NOW(), 11),
    (NULL, 0.8, 'risco', NOW(), 12),
    (NULL, 85, 'risco', NOW(), 13),
    (NULL, 80, 'risco', NOW(), 14),
    (NULL, 55, 'normal', NOW(), 15),
    (NULL, 110, 'normal', NOW(), 16),
    (NULL, 65, 'normal', NOW(), 17),
    (NULL, 65, 'normal', NOW(), 18),
    (NULL, 2, 'normal', NOW(), 19),
    (NULL, 65, 'normal', NOW(), 20),
    (NULL, 190, 'normal', NOW(), 21),
    (NULL, 80, 'critico', NOW(), 22),
    (NULL, 150, 'critico', NOW(), 23),
    (NULL, 95, 'critico', NOW(), 24),
    (NULL, 96, 'critico', NOW(), 25),
    (NULL, 0.2, 'critico', NOW(), 26),
    (NULL, 93, 'critico', NOW(), 27),
    (NULL, 20, 'critico', NOW(), 28),
    (NULL, 40, 'normal', NOW(), 29),
    (NULL, 90, 'normal', NOW(), 30),
    (NULL, 50, 'normal', NOW(), 31),
    (NULL, 65, 'normal', NOW(), 32),
    (NULL, 3, 'normal', NOW(), 33),
    (NULL, 55, 'normal', NOW(), 34),
    (NULL, 450, 'normal', NOW(), 35),
    (NULL, 60, 'risco', NOW(), 36),
    (NULL, 125, 'risco', NOW(), 37),
    (NULL, 80, 'risco', NOW(), 38),
    (NULL, 86, 'risco', NOW(), 39),
    (NULL, 0.7, 'risco', NOW(), 40),
    (NULL, 84, 'risco', NOW(), 41),
    (NULL, 80, 'risco', NOW(), 42),
    (NULL, 30, 'normal', NOW(), 43),
    (NULL, 80, 'normal', NOW(), 44),
    (NULL, 10, 'normal', NOW(), 45),
    (NULL, 15, 'normal', NOW(), 46),
    (NULL, 6.5, 'normal', NOW(), 47),
    (NULL, 25, 'normal', NOW(), 48),
    (NULL, 750, 'normal', NOW(), 49),
    (NULL, 62, 'risco', NOW(), 50),
    (NULL, 120, 'risco', NOW(), 51),
    (NULL, 80, 'risco', NOW(), 52),
    (NULL, 90, 'risco', NOW(), 53),
    (NULL, 0.4, 'risco', NOW(), 54),
    (NULL, 85, 'risco', NOW(), 55),
    (NULL, 80, 'risco', NOW(), 56);

DO SLEEP(5);

INSERT INTO
    medicao
VALUES
    (NULL, 45, 'normal', NOW(), 1),
    (NULL, 102, 'normal', NOW(), 2),
    (NULL, 50, 'normal', NOW(), 3),
    (NULL, 65, 'normal', NOW(), 4),
    (NULL, 2, 'normal', NOW(), 5),
    (NULL, 67, 'normal', NOW(), 6),
    (NULL, 160, 'normal', NOW(), 7),
    (NULL, 62, 'risco', NOW(), 8),
    (NULL, 120, 'risco', NOW(), 9),
    (NULL, 82, 'risco', NOW(), 10),
    (NULL, 83, 'risco', NOW(), 11),
    (NULL, 0.9, 'risco', NOW(), 12),
    (NULL, 86, 'risco', NOW(), 13),
    (NULL, 70, 'risco', NOW(), 14),
    (NULL, 50, 'normal', NOW(), 15),
    (NULL, 100, 'normal', NOW(), 16),
    (NULL, 60, 'normal', NOW(), 17),
    (NULL, 60, 'normal', NOW(), 18),
    (NULL, 3, 'normal', NOW(), 19),
    (NULL, 60, 'normal', NOW(), 20),
    (NULL, 290, 'normal', NOW(), 21),
    (NULL, 90, 'critico', NOW(), 22),
    (NULL, 140, 'critico', NOW(), 23),
    (NULL, 94, 'critico', NOW(), 24),
    (NULL, 97, 'critico', NOW(), 25),
    (NULL, 0.1, 'critico', NOW(), 26),
    (NULL, 95, 'critico', NOW(), 27),
    (NULL, 18, 'critico', NOW(), 28),
    (NULL, 30, 'normal', NOW(), 29),
    (NULL, 85, 'normal', NOW(), 30),
    (NULL, 30, 'normal', NOW(), 31),
    (NULL, 60, 'normal', NOW(), 32),
    (NULL, 3.5, 'normal', NOW(), 33),
    (NULL, 50, 'normal', NOW(), 34),
    (NULL, 500, 'normal', NOW(), 35),
    (NULL, 62, 'risco', NOW(), 36),
    (NULL, 122.5, 'risco', NOW(), 37),
    (NULL, 85, 'risco', NOW(), 38),
    (NULL, 88, 'risco', NOW(), 39),
    (NULL, 0.6, 'risco', NOW(), 40),
    (NULL, 82, 'risco', NOW(), 41),
    (NULL, 70, 'risco', NOW(), 42),
    (NULL, 28, 'normal', NOW(), 43),
    (NULL, 75, 'normal', NOW(), 44),
    (NULL, 8, 'normal', NOW(), 45),
    (NULL, 12.5, 'normal', NOW(), 46),
    (NULL, 7, 'normal', NOW(), 47),
    (NULL, 20, 'normal', NOW(), 48),
    (NULL, 800, 'normal', NOW(), 49),
    (NULL, 63.2, 'risco', NOW(), 50),
    (NULL, 121, 'risco', NOW(), 51),
    (NULL, 85, 'risco', NOW(), 52),
    (NULL, 89, 'risco', NOW(), 53),
    (NULL, 0.8, 'risco', NOW(), 54),
    (NULL, 87.5, 'risco', NOW(), 55),
    (NULL, 75, 'risco', NOW(), 56);

DO SLEEP(5);

INSERT INTO
    medicao
VALUES
    (NULL, 55, 'normal', NOW(), 1),
    (NULL, 108, 'normal', NOW(), 2),
    (NULL, 64, 'normal', NOW(), 3),
    (NULL, 72, 'normal', NOW(), 4),
    (NULL, 2, 'normal', NOW(), 5),
    (NULL, 73, 'normal', NOW(), 6),
    (NULL, 140, 'normal', NOW(), 7),
    (NULL, 70, 'risco', NOW(), 8),
    (NULL, 122, 'risco', NOW(), 9),
    (NULL, 87, 'risco', NOW(), 10),
    (NULL, 86, 'risco', NOW(), 11),
    (NULL, 0.75, 'risco', NOW(), 12),
    (NULL, 82.7, 'risco', NOW(), 13),
    (NULL, 90, 'risco', NOW(), 14),
    (NULL, 57.5, 'normal', NOW(), 15),
    (NULL, 104, 'normal', NOW(), 16),
    (NULL, 70, 'normal', NOW(), 17),
    (NULL, 70, 'normal', NOW(), 18),
    (NULL, 1.5, 'normal', NOW(), 19),
    (NULL, 70, 'normal', NOW(), 20),
    (NULL, 160, 'normal', NOW(), 21),
    (NULL, 81, 'critico', NOW(), 22),
    (NULL, 152, 'critico', NOW(), 23),
    (NULL, 97, 'critico', NOW(), 24),
    (NULL, 97.6, 'critico', NOW(), 25),
    (NULL, 0.12, 'critico', NOW(), 26),
    (NULL, 96.3, 'critico', NOW(), 27),
    (NULL, 8, 'critico', NOW(), 28),
    (NULL, 36, 'normal', NOW(), 29),
    (NULL, 87, 'normal', NOW(), 30),
    (NULL, 46, 'normal', NOW(), 31),
    (NULL, 63, 'normal', NOW(), 32),
    (NULL, 3.1, 'normal', NOW(), 33),
    (NULL, 49, 'normal', NOW(), 34),
    (NULL, 510, 'normal', NOW(), 35),
    (NULL, 64, 'risco', NOW(), 36),
    (NULL, 123, 'risco', NOW(), 37),
    (NULL, 85, 'risco', NOW(), 38),
    (NULL, 84, 'risco', NOW(), 39),
    (NULL, 0.5, 'risco', NOW(), 40),
    (NULL, 89, 'risco', NOW(), 41),
    (NULL, 60, 'risco', NOW(), 42),
    (NULL, 29, 'normal', NOW(), 43),
    (NULL, 84, 'normal', NOW(), 44),
    (NULL, 16, 'normal', NOW(), 45),
    (NULL, 25, 'normal', NOW(), 46),
    (NULL, 5, 'normal', NOW(), 47),
    (NULL, 35, 'normal', NOW(), 48),
    (NULL, 650, 'normal', NOW(), 49),
    (NULL, 67, 'risco', NOW(), 50),
    (NULL, 130, 'risco', NOW(), 51),
    (NULL, 90, 'risco', NOW(), 52),
    (NULL, 92, 'risco', NOW(), 53),
    (NULL, 0.3, 'risco', NOW(), 54),
    (NULL, 86, 'risco', NOW(), 55),
    (NULL, 70, 'risco', NOW(), 56);

DO SLEEP(5);

INSERT INTO
    medicao
VALUES
    (NULL, 50, 'normal', NOW(), 1),
    (NULL, 100, 'normal', NOW(), 2),
    (NULL, 60, 'normal', NOW(), 3),
    (NULL, 75, 'normal', NOW(), 4),
    (NULL, 1, 'normal', NOW(), 5),
    (NULL, 75, 'normal', NOW(), 6),
    (NULL, 120, 'normal', NOW(), 7),
    (NULL, 65, 'risco', NOW(), 8),
    (NULL, 120, 'risco', NOW(), 9),
    (NULL, 80, 'risco', NOW(), 10),
    (NULL, 85, 'risco', NOW(), 11),
    (NULL, 0.8, 'risco', NOW(), 12),
    (NULL, 85, 'risco', NOW(), 13),
    (NULL, 80, 'risco', NOW(), 14),
    (NULL, 55, 'normal', NOW(), 15),
    (NULL, 110, 'normal', NOW(), 16),
    (NULL, 65, 'normal', NOW(), 17),
    (NULL, 65, 'normal', NOW(), 18),
    (NULL, 2, 'normal', NOW(), 19),
    (NULL, 65, 'normal', NOW(), 20),
    (NULL, 190, 'normal', NOW(), 21),
    (NULL, 80, 'critico', NOW(), 22),
    (NULL, 150, 'critico', NOW(), 23),
    (NULL, 95, 'critico', NOW(), 24),
    (NULL, 96, 'critico', NOW(), 25),
    (NULL, 0.2, 'critico', NOW(), 26),
    (NULL, 93, 'critico', NOW(), 27),
    (NULL, 20, 'critico', NOW(), 28),
    (NULL, 40, 'normal', NOW(), 29),
    (NULL, 90, 'normal', NOW(), 30),
    (NULL, 50, 'normal', NOW(), 31),
    (NULL, 65, 'normal', NOW(), 32),
    (NULL, 3, 'normal', NOW(), 33),
    (NULL, 55, 'normal', NOW(), 34),
    (NULL, 450, 'normal', NOW(), 35),
    (NULL, 60, 'risco', NOW(), 36),
    (NULL, 125, 'risco', NOW(), 37),
    (NULL, 80, 'risco', NOW(), 38),
    (NULL, 86, 'risco', NOW(), 39),
    (NULL, 0.7, 'risco', NOW(), 40),
    (NULL, 84, 'risco', NOW(), 41),
    (NULL, 80, 'risco', NOW(), 42),
    (NULL, 30, 'normal', NOW(), 43),
    (NULL, 80, 'normal', NOW(), 44),
    (NULL, 10, 'normal', NOW(), 45),
    (NULL, 15, 'normal', NOW(), 46),
    (NULL, 6.5, 'normal', NOW(), 47),
    (NULL, 25, 'normal', NOW(), 48),
    (NULL, 750, 'normal', NOW(), 49),
    (NULL, 62, 'risco', NOW(), 50),
    (NULL, 120, 'risco', NOW(), 51),
    (NULL, 80, 'risco', NOW(), 52),
    (NULL, 90, 'risco', NOW(), 53),
    (NULL, 0.4, 'risco', NOW(), 54),
    (NULL, 85, 'risco', NOW(), 55),
    (NULL, 80, 'risco', NOW(), 56);

DO SLEEP(5);

INSERT INTO
    medicao
VALUES
    (NULL, 45, 'normal', NOW(), 1),
    (NULL, 102, 'normal', NOW(), 2),
    (NULL, 50, 'normal', NOW(), 3),
    (NULL, 65, 'normal', NOW(), 4),
    (NULL, 2, 'normal', NOW(), 5),
    (NULL, 67, 'normal', NOW(), 6),
    (NULL, 160, 'normal', NOW(), 7),
    (NULL, 62, 'risco', NOW(), 8),
    (NULL, 120, 'risco', NOW(), 9),
    (NULL, 82, 'risco', NOW(), 10),
    (NULL, 83, 'risco', NOW(), 11),
    (NULL, 0.9, 'risco', NOW(), 12),
    (NULL, 86, 'risco', NOW(), 13),
    (NULL, 70, 'risco', NOW(), 14),
    (NULL, 50, 'normal', NOW(), 15),
    (NULL, 100, 'normal', NOW(), 16),
    (NULL, 60, 'normal', NOW(), 17),
    (NULL, 60, 'normal', NOW(), 18),
    (NULL, 3, 'normal', NOW(), 19),
    (NULL, 60, 'normal', NOW(), 20),
    (NULL, 290, 'normal', NOW(), 21),
    (NULL, 90, 'critico', NOW(), 22),
    (NULL, 140, 'critico', NOW(), 23),
    (NULL, 94, 'critico', NOW(), 24),
    (NULL, 97, 'critico', NOW(), 25),
    (NULL, 0.1, 'critico', NOW(), 26),
    (NULL, 95, 'critico', NOW(), 27),
    (NULL, 18, 'critico', NOW(), 28),
    (NULL, 30, 'normal', NOW(), 29),
    (NULL, 85, 'normal', NOW(), 30),
    (NULL, 30, 'normal', NOW(), 31),
    (NULL, 60, 'normal', NOW(), 32),
    (NULL, 3.5, 'normal', NOW(), 33),
    (NULL, 50, 'normal', NOW(), 34),
    (NULL, 500, 'normal', NOW(), 35),
    (NULL, 62, 'risco', NOW(), 36),
    (NULL, 122.5, 'risco', NOW(), 37),
    (NULL, 85, 'risco', NOW(), 38),
    (NULL, 88, 'risco', NOW(), 39),
    (NULL, 0.6, 'risco', NOW(), 40),
    (NULL, 82, 'risco', NOW(), 41),
    (NULL, 70, 'risco', NOW(), 42),
    (NULL, 28, 'normal', NOW(), 43),
    (NULL, 75, 'normal', NOW(), 44),
    (NULL, 8, 'normal', NOW(), 45),
    (NULL, 12.5, 'normal', NOW(), 46),
    (NULL, 7, 'normal', NOW(), 47),
    (NULL, 20, 'normal', NOW(), 48),
    (NULL, 800, 'normal', NOW(), 49),
    (NULL, 63.2, 'risco', NOW(), 50),
    (NULL, 121, 'risco', NOW(), 51),
    (NULL, 85, 'risco', NOW(), 52),
    (NULL, 89, 'risco', NOW(), 53),
    (NULL, 0.8, 'risco', NOW(), 54),
    (NULL, 87.5, 'risco', NOW(), 55),
    (NULL, 75, 'risco', NOW(), 56);

DO SLEEP(5);

INSERT INTO
    medicao
VALUES
    (NULL, 55, 'normal', NOW(), 1),
    (NULL, 108, 'normal', NOW(), 2),
    (NULL, 64, 'normal', NOW(), 3),
    (NULL, 72, 'normal', NOW(), 4),
    (NULL, 2, 'normal', NOW(), 5),
    (NULL, 73, 'normal', NOW(), 6),
    (NULL, 140, 'normal', NOW(), 7),
    (NULL, 70, 'risco', NOW(), 8),
    (NULL, 122, 'risco', NOW(), 9),
    (NULL, 87, 'risco', NOW(), 10),
    (NULL, 86, 'risco', NOW(), 11),
    (NULL, 0.75, 'risco', NOW(), 12),
    (NULL, 82.7, 'risco', NOW(), 13),
    (NULL, 90, 'risco', NOW(), 14),
    (NULL, 57.5, 'normal', NOW(), 15),
    (NULL, 104, 'normal', NOW(), 16),
    (NULL, 70, 'normal', NOW(), 17),
    (NULL, 70, 'normal', NOW(), 18),
    (NULL, 1.5, 'normal', NOW(), 19),
    (NULL, 70, 'normal', NOW(), 20),
    (NULL, 160, 'normal', NOW(), 21),
    (NULL, 81, 'critico', NOW(), 22),
    (NULL, 152, 'critico', NOW(), 23),
    (NULL, 97, 'critico', NOW(), 24),
    (NULL, 97.6, 'critico', NOW(), 25),
    (NULL, 0.12, 'critico', NOW(), 26),
    (NULL, 96.3, 'critico', NOW(), 27),
    (NULL, 8, 'critico', NOW(), 28),
    (NULL, 36, 'normal', NOW(), 29),
    (NULL, 87, 'normal', NOW(), 30),
    (NULL, 46, 'normal', NOW(), 31),
    (NULL, 63, 'normal', NOW(), 32),
    (NULL, 3.1, 'normal', NOW(), 33),
    (NULL, 49, 'normal', NOW(), 34),
    (NULL, 510, 'normal', NOW(), 35),
    (NULL, 64, 'risco', NOW(), 36),
    (NULL, 123, 'risco', NOW(), 37),
    (NULL, 85, 'risco', NOW(), 38),
    (NULL, 84, 'risco', NOW(), 39),
    (NULL, 0.5, 'risco', NOW(), 40),
    (NULL, 89, 'risco', NOW(), 41),
    (NULL, 60, 'risco', NOW(), 42),
    (NULL, 29, 'normal', NOW(), 43),
    (NULL, 84, 'normal', NOW(), 44),
    (NULL, 16, 'normal', NOW(), 45),
    (NULL, 25, 'normal', NOW(), 46),
    (NULL, 5, 'normal', NOW(), 47),
    (NULL, 35, 'normal', NOW(), 48),
    (NULL, 650, 'normal', NOW(), 49),
    (NULL, 67, 'risco', NOW(), 50),
    (NULL, 130, 'risco', NOW(), 51),
    (NULL, 90, 'risco', NOW(), 52),
    (NULL, 92, 'risco', NOW(), 53),
    (NULL, 0.3, 'risco', NOW(), 54),
    (NULL, 86, 'risco', NOW(), 55),
    (NULL, 70, 'risco', NOW(), 56);

DO SLEEP(5);

INSERT INTO
    medicao
VALUES
    (NULL, 50, 'normal', NOW(), 1),
    (NULL, 100, 'normal', NOW(), 2),
    (NULL, 60, 'normal', NOW(), 3),
    (NULL, 75, 'normal', NOW(), 4),
    (NULL, 1, 'normal', NOW(), 5),
    (NULL, 75, 'normal', NOW(), 6),
    (NULL, 120, 'normal', NOW(), 7),
    (NULL, 65, 'risco', NOW(), 8),
    (NULL, 120, 'risco', NOW(), 9),
    (NULL, 80, 'risco', NOW(), 10),
    (NULL, 85, 'risco', NOW(), 11),
    (NULL, 0.8, 'risco', NOW(), 12),
    (NULL, 85, 'risco', NOW(), 13),
    (NULL, 80, 'risco', NOW(), 14),
    (NULL, 55, 'normal', NOW(), 15),
    (NULL, 110, 'normal', NOW(), 16),
    (NULL, 65, 'normal', NOW(), 17),
    (NULL, 65, 'normal', NOW(), 18),
    (NULL, 2, 'normal', NOW(), 19),
    (NULL, 65, 'normal', NOW(), 20),
    (NULL, 190, 'normal', NOW(), 21),
    (NULL, 80, 'critico', NOW(), 22),
    (NULL, 150, 'critico', NOW(), 23),
    (NULL, 95, 'critico', NOW(), 24),
    (NULL, 96, 'critico', NOW(), 25),
    (NULL, 0.2, 'critico', NOW(), 26),
    (NULL, 93, 'critico', NOW(), 27),
    (NULL, 20, 'critico', NOW(), 28),
    (NULL, 40, 'normal', NOW(), 29),
    (NULL, 90, 'normal', NOW(), 30),
    (NULL, 50, 'normal', NOW(), 31),
    (NULL, 65, 'normal', NOW(), 32),
    (NULL, 3, 'normal', NOW(), 33),
    (NULL, 55, 'normal', NOW(), 34),
    (NULL, 450, 'normal', NOW(), 35),
    (NULL, 60, 'risco', NOW(), 36),
    (NULL, 125, 'risco', NOW(), 37),
    (NULL, 80, 'risco', NOW(), 38),
    (NULL, 86, 'risco', NOW(), 39),
    (NULL, 0.7, 'risco', NOW(), 40),
    (NULL, 84, 'risco', NOW(), 41),
    (NULL, 80, 'risco', NOW(), 42),
    (NULL, 30, 'normal', NOW(), 43),
    (NULL, 80, 'normal', NOW(), 44),
    (NULL, 10, 'normal', NOW(), 45),
    (NULL, 15, 'normal', NOW(), 46),
    (NULL, 6.5, 'normal', NOW(), 47),
    (NULL, 25, 'normal', NOW(), 48),
    (NULL, 750, 'normal', NOW(), 49),
    (NULL, 62, 'risco', NOW(), 50),
    (NULL, 120, 'risco', NOW(), 51),
    (NULL, 80, 'risco', NOW(), 52),
    (NULL, 90, 'risco', NOW(), 53),
    (NULL, 0.4, 'risco', NOW(), 54),
    (NULL, 85, 'risco', NOW(), 55),
    (NULL, 80, 'risco', NOW(), 56);

DO SLEEP(5);

INSERT INTO
    medicao
VALUES
    (NULL, 45, 'normal', NOW(), 1),
    (NULL, 102, 'normal', NOW(), 2),
    (NULL, 50, 'normal', NOW(), 3),
    (NULL, 65, 'normal', NOW(), 4),
    (NULL, 2, 'normal', NOW(), 5),
    (NULL, 67, 'normal', NOW(), 6),
    (NULL, 160, 'normal', NOW(), 7),
    (NULL, 62, 'risco', NOW(), 8),
    (NULL, 120, 'risco', NOW(), 9),
    (NULL, 82, 'risco', NOW(), 10),
    (NULL, 83, 'risco', NOW(), 11),
    (NULL, 0.9, 'risco', NOW(), 12),
    (NULL, 86, 'risco', NOW(), 13),
    (NULL, 70, 'risco', NOW(), 14),
    (NULL, 50, 'normal', NOW(), 15),
    (NULL, 100, 'normal', NOW(), 16),
    (NULL, 60, 'normal', NOW(), 17),
    (NULL, 60, 'normal', NOW(), 18),
    (NULL, 3, 'normal', NOW(), 19),
    (NULL, 60, 'normal', NOW(), 20),
    (NULL, 290, 'normal', NOW(), 21),
    (NULL, 90, 'critico', NOW(), 22),
    (NULL, 140, 'critico', NOW(), 23),
    (NULL, 94, 'critico', NOW(), 24),
    (NULL, 97, 'critico', NOW(), 25),
    (NULL, 0.1, 'critico', NOW(), 26),
    (NULL, 95, 'critico', NOW(), 27),
    (NULL, 18, 'critico', NOW(), 28),
    (NULL, 30, 'normal', NOW(), 29),
    (NULL, 85, 'normal', NOW(), 30),
    (NULL, 30, 'normal', NOW(), 31),
    (NULL, 60, 'normal', NOW(), 32),
    (NULL, 3.5, 'normal', NOW(), 33),
    (NULL, 50, 'normal', NOW(), 34),
    (NULL, 500, 'normal', NOW(), 35),
    (NULL, 62, 'risco', NOW(), 36),
    (NULL, 122.5, 'risco', NOW(), 37),
    (NULL, 85, 'risco', NOW(), 38),
    (NULL, 88, 'risco', NOW(), 39),
    (NULL, 0.6, 'risco', NOW(), 40),
    (NULL, 82, 'risco', NOW(), 41),
    (NULL, 70, 'risco', NOW(), 42),
    (NULL, 28, 'normal', NOW(), 43),
    (NULL, 75, 'normal', NOW(), 44),
    (NULL, 8, 'normal', NOW(), 45),
    (NULL, 12.5, 'normal', NOW(), 46),
    (NULL, 7, 'normal', NOW(), 47),
    (NULL, 20, 'normal', NOW(), 48),
    (NULL, 800, 'normal', NOW(), 49),
    (NULL, 63.2, 'risco', NOW(), 50),
    (NULL, 121, 'risco', NOW(), 51),
    (NULL, 85, 'risco', NOW(), 52),
    (NULL, 89, 'risco', NOW(), 53),
    (NULL, 0.8, 'risco', NOW(), 54),
    (NULL, 87.5, 'risco', NOW(), 55),
    (NULL, 75, 'risco', NOW(), 56);

DO SLEEP(5);

INSERT INTO
    medicao
VALUES
    (NULL, 55, 'normal', NOW(), 1),
    (NULL, 108, 'normal', NOW(), 2),
    (NULL, 64, 'normal', NOW(), 3),
    (NULL, 72, 'normal', NOW(), 4),
    (NULL, 2, 'normal', NOW(), 5),
    (NULL, 73, 'normal', NOW(), 6),
    (NULL, 140, 'normal', NOW(), 7),
    (NULL, 70, 'risco', NOW(), 8),
    (NULL, 122, 'risco', NOW(), 9),
    (NULL, 87, 'risco', NOW(), 10),
    (NULL, 86, 'risco', NOW(), 11),
    (NULL, 0.75, 'risco', NOW(), 12),
    (NULL, 82.7, 'risco', NOW(), 13),
    (NULL, 90, 'risco', NOW(), 14),
    (NULL, 57.5, 'normal', NOW(), 15),
    (NULL, 104, 'normal', NOW(), 16),
    (NULL, 70, 'normal', NOW(), 17),
    (NULL, 70, 'normal', NOW(), 18),
    (NULL, 1.5, 'normal', NOW(), 19),
    (NULL, 70, 'normal', NOW(), 20),
    (NULL, 160, 'normal', NOW(), 21),
    (NULL, 81, 'critico', NOW(), 22),
    (NULL, 152, 'critico', NOW(), 23),
    (NULL, 97, 'critico', NOW(), 24),
    (NULL, 97.6, 'critico', NOW(), 25),
    (NULL, 0.12, 'critico', NOW(), 26),
    (NULL, 96.3, 'critico', NOW(), 27),
    (NULL, 8, 'critico', NOW(), 28),
    (NULL, 36, 'normal', NOW(), 29),
    (NULL, 87, 'normal', NOW(), 30),
    (NULL, 46, 'normal', NOW(), 31),
    (NULL, 63, 'normal', NOW(), 32),
    (NULL, 3.1, 'normal', NOW(), 33),
    (NULL, 49, 'normal', NOW(), 34),
    (NULL, 510, 'normal', NOW(), 35),
    (NULL, 64, 'risco', NOW(), 36),
    (NULL, 123, 'risco', NOW(), 37),
    (NULL, 85, 'risco', NOW(), 38),
    (NULL, 84, 'risco', NOW(), 39),
    (NULL, 0.5, 'risco', NOW(), 40),
    (NULL, 89, 'risco', NOW(), 41),
    (NULL, 60, 'risco', NOW(), 42),
    (NULL, 29, 'normal', NOW(), 43),
    (NULL, 84, 'normal', NOW(), 44),
    (NULL, 16, 'normal', NOW(), 45),
    (NULL, 25, 'normal', NOW(), 46),
    (NULL, 5, 'normal', NOW(), 47),
    (NULL, 35, 'normal', NOW(), 48),
    (NULL, 650, 'normal', NOW(), 49),
    (NULL, 67, 'risco', NOW(), 50),
    (NULL, 130, 'risco', NOW(), 51),
    (NULL, 90, 'risco', NOW(), 52),
    (NULL, 92, 'risco', NOW(), 53),
    (NULL, 0.3, 'risco', NOW(), 54),
    (NULL, 86, 'risco', NOW(), 55),
    (NULL, 70, 'risco', NOW(), 56);

DO SLEEP(5);

INSERT INTO
    medicao
VALUES
    (NULL, 50, 'normal', NOW(), 1),
    (NULL, 100, 'normal', NOW(), 2),
    (NULL, 60, 'normal', NOW(), 3),
    (NULL, 75, 'normal', NOW(), 4),
    (NULL, 1, 'normal', NOW(), 5),
    (NULL, 75, 'normal', NOW(), 6),
    (NULL, 120, 'normal', NOW(), 7),
    (NULL, 65, 'risco', NOW(), 8),
    (NULL, 120, 'risco', NOW(), 9),
    (NULL, 80, 'risco', NOW(), 10),
    (NULL, 85, 'risco', NOW(), 11),
    (NULL, 0.8, 'risco', NOW(), 12),
    (NULL, 85, 'risco', NOW(), 13),
    (NULL, 80, 'risco', NOW(), 14),
    (NULL, 55, 'normal', NOW(), 15),
    (NULL, 110, 'normal', NOW(), 16),
    (NULL, 65, 'normal', NOW(), 17),
    (NULL, 65, 'normal', NOW(), 18),
    (NULL, 2, 'normal', NOW(), 19),
    (NULL, 65, 'normal', NOW(), 20),
    (NULL, 190, 'normal', NOW(), 21),
    (NULL, 80, 'critico', NOW(), 22),
    (NULL, 150, 'critico', NOW(), 23),
    (NULL, 95, 'critico', NOW(), 24),
    (NULL, 96, 'critico', NOW(), 25),
    (NULL, 0.2, 'critico', NOW(), 26),
    (NULL, 93, 'critico', NOW(), 27),
    (NULL, 20, 'critico', NOW(), 28),
    (NULL, 40, 'normal', NOW(), 29),
    (NULL, 90, 'normal', NOW(), 30),
    (NULL, 50, 'normal', NOW(), 31),
    (NULL, 65, 'normal', NOW(), 32),
    (NULL, 3, 'normal', NOW(), 33),
    (NULL, 55, 'normal', NOW(), 34),
    (NULL, 450, 'normal', NOW(), 35),
    (NULL, 60, 'risco', NOW(), 36),
    (NULL, 125, 'risco', NOW(), 37),
    (NULL, 80, 'risco', NOW(), 38),
    (NULL, 86, 'risco', NOW(), 39),
    (NULL, 0.7, 'risco', NOW(), 40),
    (NULL, 84, 'risco', NOW(), 41),
    (NULL, 80, 'risco', NOW(), 42),
    (NULL, 30, 'normal', NOW(), 43),
    (NULL, 80, 'normal', NOW(), 44),
    (NULL, 10, 'normal', NOW(), 45),
    (NULL, 15, 'normal', NOW(), 46),
    (NULL, 6.5, 'normal', NOW(), 47),
    (NULL, 25, 'normal', NOW(), 48),
    (NULL, 750, 'normal', NOW(), 49),
    (NULL, 62, 'risco', NOW(), 50),
    (NULL, 120, 'risco', NOW(), 51),
    (NULL, 80, 'risco', NOW(), 52),
    (NULL, 90, 'risco', NOW(), 53),
    (NULL, 0.4, 'risco', NOW(), 54),
    (NULL, 85, 'risco', NOW(), 55),
    (NULL, 80, 'risco', NOW(), 56);

DO SLEEP(5);

INSERT INTO
    medicao
VALUES
    (NULL, 45, 'normal', NOW(), 1),
    (NULL, 102, 'normal', NOW(), 2),
    (NULL, 50, 'normal', NOW(), 3),
    (NULL, 65, 'normal', NOW(), 4),
    (NULL, 2, 'normal', NOW(), 5),
    (NULL, 67, 'normal', NOW(), 6),
    (NULL, 160, 'normal', NOW(), 7),
    (NULL, 62, 'risco', NOW(), 8),
    (NULL, 120, 'risco', NOW(), 9),
    (NULL, 82, 'risco', NOW(), 10),
    (NULL, 83, 'risco', NOW(), 11),
    (NULL, 0.9, 'risco', NOW(), 12),
    (NULL, 86, 'risco', NOW(), 13),
    (NULL, 70, 'risco', NOW(), 14),
    (NULL, 50, 'normal', NOW(), 15),
    (NULL, 100, 'normal', NOW(), 16),
    (NULL, 60, 'normal', NOW(), 17),
    (NULL, 60, 'normal', NOW(), 18),
    (NULL, 3, 'normal', NOW(), 19),
    (NULL, 60, 'normal', NOW(), 20),
    (NULL, 290, 'normal', NOW(), 21),
    (NULL, 90, 'critico', NOW(), 22),
    (NULL, 140, 'critico', NOW(), 23),
    (NULL, 94, 'critico', NOW(), 24),
    (NULL, 97, 'critico', NOW(), 25),
    (NULL, 0.1, 'critico', NOW(), 26),
    (NULL, 95, 'critico', NOW(), 27),
    (NULL, 18, 'critico', NOW(), 28),
    (NULL, 30, 'normal', NOW(), 29),
    (NULL, 85, 'normal', NOW(), 30),
    (NULL, 30, 'normal', NOW(), 31),
    (NULL, 60, 'normal', NOW(), 32),
    (NULL, 3.5, 'normal', NOW(), 33),
    (NULL, 50, 'normal', NOW(), 34),
    (NULL, 500, 'normal', NOW(), 35),
    (NULL, 62, 'risco', NOW(), 36),
    (NULL, 122.5, 'risco', NOW(), 37),
    (NULL, 85, 'risco', NOW(), 38),
    (NULL, 88, 'risco', NOW(), 39),
    (NULL, 0.6, 'risco', NOW(), 40),
    (NULL, 82, 'risco', NOW(), 41),
    (NULL, 70, 'risco', NOW(), 42),
    (NULL, 28, 'normal', NOW(), 43),
    (NULL, 75, 'normal', NOW(), 44),
    (NULL, 8, 'normal', NOW(), 45),
    (NULL, 12.5, 'normal', NOW(), 46),
    (NULL, 7, 'normal', NOW(), 47),
    (NULL, 20, 'normal', NOW(), 48),
    (NULL, 800, 'normal', NOW(), 49),
    (NULL, 63.2, 'risco', NOW(), 50),
    (NULL, 121, 'risco', NOW(), 51),
    (NULL, 85, 'risco', NOW(), 52),
    (NULL, 89, 'risco', NOW(), 53),
    (NULL, 0.8, 'risco', NOW(), 54),
    (NULL, 87.5, 'risco', NOW(), 55),
    (NULL, 75, 'risco', NOW(), 56);

DO SLEEP(5);

INSERT INTO
    medicao
VALUES
    (NULL, 55, 'normal', NOW(), 1),
    (NULL, 108, 'normal', NOW(), 2),
    (NULL, 64, 'normal', NOW(), 3),
    (NULL, 72, 'normal', NOW(), 4),
    (NULL, 2, 'normal', NOW(), 5),
    (NULL, 73, 'normal', NOW(), 6),
    (NULL, 140, 'normal', NOW(), 7),
    (NULL, 70, 'risco', NOW(), 8),
    (NULL, 122, 'risco', NOW(), 9),
    (NULL, 87, 'risco', NOW(), 10),
    (NULL, 86, 'risco', NOW(), 11),
    (NULL, 0.75, 'risco', NOW(), 12),
    (NULL, 82.7, 'risco', NOW(), 13),
    (NULL, 90, 'risco', NOW(), 14),
    (NULL, 57.5, 'normal', NOW(), 15),
    (NULL, 104, 'normal', NOW(), 16),
    (NULL, 70, 'normal', NOW(), 17),
    (NULL, 70, 'normal', NOW(), 18),
    (NULL, 1.5, 'normal', NOW(), 19),
    (NULL, 70, 'normal', NOW(), 20),
    (NULL, 160, 'normal', NOW(), 21),
    (NULL, 81, 'critico', NOW(), 22),
    (NULL, 152, 'critico', NOW(), 23),
    (NULL, 97, 'critico', NOW(), 24),
    (NULL, 97.6, 'critico', NOW(), 25),
    (NULL, 0.12, 'critico', NOW(), 26),
    (NULL, 96.3, 'critico', NOW(), 27),
    (NULL, 8, 'critico', NOW(), 28),
    (NULL, 36, 'normal', NOW(), 29),
    (NULL, 87, 'normal', NOW(), 30),
    (NULL, 46, 'normal', NOW(), 31),
    (NULL, 63, 'normal', NOW(), 32),
    (NULL, 3.1, 'normal', NOW(), 33),
    (NULL, 49, 'normal', NOW(), 34),
    (NULL, 510, 'normal', NOW(), 35),
    (NULL, 64, 'risco', NOW(), 36),
    (NULL, 123, 'risco', NOW(), 37),
    (NULL, 85, 'risco', NOW(), 38),
    (NULL, 84, 'risco', NOW(), 39),
    (NULL, 0.5, 'risco', NOW(), 40),
    (NULL, 89, 'risco', NOW(), 41),
    (NULL, 60, 'risco', NOW(), 42),
    (NULL, 29, 'normal', NOW(), 43),
    (NULL, 84, 'normal', NOW(), 44),
    (NULL, 16, 'normal', NOW(), 45),
    (NULL, 25, 'normal', NOW(), 46),
    (NULL, 5, 'normal', NOW(), 47),
    (NULL, 35, 'normal', NOW(), 48),
    (NULL, 650, 'normal', NOW(), 49),
    (NULL, 67, 'risco', NOW(), 50),
    (NULL, 130, 'risco', NOW(), 51),
    (NULL, 90, 'risco', NOW(), 52),
    (NULL, 92, 'risco', NOW(), 53),
    (NULL, 0.3, 'risco', NOW(), 54),
    (NULL, 86, 'risco', NOW(), 55),
    (NULL, 70, 'risco', NOW(), 56);