DROP DATABASE safelog_analytics;

CREATE DATABASE safelog_analytics;

USE safelog_analytics;

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
    token char(8),
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
    limite_cpu decimal(5, 2),
    limite_ram decimal(5, 2),
    limite_disco decimal(5, 2),
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

CREATE TABLE analytics (
    id_dado int PRIMARY KEY AUTO_INCREMENT,
    cpu decimal(5, 2),
    ram decimal(5, 2),
    disco decimal(5, 2),
    data_medicao datetime,
    fk_maquina varchar(20),
    FOREIGN KEY (fk_maquina) REFERENCES maquina(id_maquina)
);

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
        'abnanvf5',
        '203783731',
        NULL
    ),
    (
        NULL,
        'Gilson Finkelsztain',
        'gilson.finkelsztain@gmail.com',
        MD5('ExSenha1'),
        'admin',
        'arblvsfa',
        '09.346.601/0001-25',
        NULL
    ),
    (
        NULL,
        'Raymond E. Miller',
        'raymond.miller@gmail.com',
        MD5('ExSenha1'),
        'gestor',
        '9katbzd7',
        '203783731',
        1
    ),
    (
        NULL,
        'Kauã Rodrigues Pinto',
        'kaua.rodrigues@gmail.com',
        MD5('ExSenha1'),
        'gestor',
        'skcmqdix',
        '09.346.601/0001-25',
        2
    ),
    (
        NULL,
        'Andrew K. Hutson',
        'andrew.hutson@gmail.com',
        MD5('ExSenha1'),
        'gestor',
        'k8xd9pys',
        '203783731',
        1
    ),
    (
        NULL,
        'Julia Ferreira Pinto',
        'julia.ferreira@gmail.com',
        MD5('ExSenha1'),
        'gestor',
        'z4d62p9x',
        '09.346.601/0001-25',
        2
    ),
    (
        NULL,
        'Harvey M. Knudsen',
        'harvey.knudsen@gmail.com',
        MD5('ExSenha1'),
        'analista',
        'f3edujdq',
        '203783731',
        3
    ),
    (
        NULL,
        'Eduardo Pereira Azevedo',
        'eduardo.azevedo@gmail.com',
        MD5('ExSenha1'),
        'analista',
        'd64h81ab',
        '09.346.601/0001-25',
        4
    ),
    (
        NULL,
        'Laura E. Meade',
        'laura.meade@gmail.com',
        MD5('ExSenha1'),
        'analista',
        'gcmjx9u3',
        '203783731',
        3
    ),
    (
        NULL,
        'Douglas Sousa Dias',
        'douglas.dias@gmail.com',
        MD5('ExSenha1'),
        'analista',
        'agdjkvxw',
        '09.346.601/0001-25',
        4
    ),
    (
        NULL,
        'Pamela T. Lennox',
        'pamela.lennox@gmail.com',
        MD5('ExSenha1'),
        'analista',
        'j2akj5pv',
        '203783731',
        5
    ),
    (
        NULL,
        'Júlio Sousa Azevedo',
        'julio.azevedo@gmail.com',
        MD5('ExSenha1'),
        'analista',
        'bet0g4wc',
        '09.346.601/0001-25',
        6
    ),
    (
        NULL,
        'Susan K. Adams',
        'susan.adams@gmail.com',
        MD5('ExSenha1'),
        'analista',
        'mc4y8gaw',
        '203783731',
        5
    ),
    (
        NULL,
        'Nicole Silva Gomes',
        'nicole.gomes@gmail.com',
        MD5('ExSenha1'),
        'analista',
        '3pta7uqx',
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
        75.0,
        80.0,
        85.0,
        '203783731'
    ),
    (
        '2f-d0-bb-62-61-14',
        'Server2',
        MD5('ExSenha1'),
        70.0,
        85.0,
        80.0,
        '203783731'
    ),
    (
        'a3-4e-5e-38-96-be',
        'Server3',
        MD5('ExSenha1'),
        80.0,
        85.0,
        90.0,
        '203783731'
    ),
    (
        '7b-a0-1d-74-7f-68',
        'Server4',
        MD5('ExSenha1'),
        50.0,
        60.0,
        90.0,
        '203783731'
    ),
    (
        '87-6d-74-ea-b8-d6',
        'Servidor1',
        MD5('ExSenha1'),
        90.0,
        70.0,
        70.0,
        '09.346.601/0001-25'
    ),
    (
        '03-db-e0-03-dd-f2',
        'Servidor2',
        MD5('ExSenha1'),
        46.7,
        63.5,
        75.0,
        '09.346.601/0001-25'
    ),
    (
        '67-8f-75-1a-a2-e0',
        'Servidor3',
        MD5('ExSenha1'),
        65.0,
        70.0,
        75.0,
        '09.346.601/0001-25'
    ),
    (
        '87-f4-a2-f4-26-7f',
        'Servidor4',
        MD5('ExSenha1'),
        55.0,
        60.0,
        65.0,
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
    analytics
VALUES
    (
        NULL,
        58.0,
        89.0,
        74.3,
        NOW(),
        '73-04-cd-e5-6f-a0'
    ),
    (
        NULL,
        19.5,
        13.9,
        7.3,
        NOW(),
        '2f-d0-bb-62-61-14'
    ),
    (
        NULL,
        23.8,
        14.5,
        85.2,
        NOW(),
        'a3-4e-5e-38-96-be'
    ),
    (NULL, 3.8, 8.6, 48.7, NOW(), '7b-a0-1d-74-7f-68'),
    (
        NULL,
        85.3,
        65.4,
        68.4,
        NOW(),
        '87-6d-74-ea-b8-d6'
    ),
    (
        NULL,
        59.2,
        47.9,
        74.1,
        NOW(),
        '03-db-e0-03-dd-f2'
    ),
    (
        NULL,
        79.5,
        9.7,
        43.4,
        NOW(),
        '67-8f-75-1a-a2-e0'
    ),
    (
        NULL,
        72.1,
        69.3,
        87.9,
        NOW(),
        '87-f4-a2-f4-26-7f'
    ),
    (
        NULL,
        60.0,
        78.0,
        74.3,
        NOW(),
        '73-04-cd-e5-6f-a0'
    ),
    (
        NULL,
        26.5,
        28.3,
        10.4,
        NOW(),
        '2f-d0-bb-62-61-14'
    ),
    (
        NULL,
        19.8,
        12.5,
        85.2,
        NOW(),
        'a3-4e-5e-38-96-be'
    ),
    (NULL, 5, 12, 50.0, NOW(), '7b-a0-1d-74-7f-68'),
    (NULL, 90, 63, 69, NOW(), '87-6d-74-ea-b8-d6'),
    (NULL, 60, 45, 75, NOW(), '03-db-e0-03-dd-f2'),
    (NULL, 80, 15, 36.4, NOW(), '67-8f-75-1a-a2-e0'),
    (
        NULL,
        72.1,
        69.3,
        87.9,
        NOW(),
        '87-f4-a2-f4-26-7f'
    ),
    (
        NULL,
        35.0,
        91.0,
        70.3,
        NOW(),
        '73-04-cd-e5-6f-a0'
    ),
    (
        NULL,
        46.5,
        9.9,
        17.3,
        NOW(),
        '2f-d0-bb-62-61-14'
    ),
    (
        NULL,
        18.8,
        19.5,
        85.2,
        NOW(),
        'a3-4e-5e-38-96-be'
    ),
    (NULL, 2, 6, 48, NOW(), '7b-a0-1d-74-7f-68'),
    (NULL, 92, 65.4, 69.4, NOW(), '87-6d-74-ea-b8-d6'),
    (
        NULL,
        49.2,
        47.9,
        74.1,
        NOW(),
        '03-db-e0-03-dd-f2'
    ),
    (NULL, 69.5, 11, 40.4, NOW(), '67-8f-75-1a-a2-e0'),
    (NULL, 82.1, 80.3, 85, NOW(), '87-f4-a2-f4-26-7f'),
    (
        NULL,
        45.0,
        77.0,
        69.3,
        NOW(),
        '73-04-cd-e5-6f-a0'
    ),
    (NULL, 33.5, 15, 18, NOW(), '2f-d0-bb-62-61-14'),
    (
        NULL,
        18.8,
        23.5,
        84.2,
        NOW(),
        'a3-4e-5e-38-96-be'
    ),
    (NULL, 9, 6, 49, NOW(), '7b-a0-1d-74-7f-68'),
    (NULL, 81, 65.4, 66.4, NOW(), '87-6d-74-ea-b8-d6'),
    (
        NULL,
        38.2,
        47.9,
        72.1,
        NOW(),
        '03-db-e0-03-dd-f2'
    ),
    (NULL, 78.5, 11, 40.4, NOW(), '67-8f-75-1a-a2-e0'),
    (NULL, 88.1, 80.3, 85, NOW(), '87-f4-a2-f4-26-7f'),
    (
        NULL,
        58.0,
        89.0,
        74.3,
        NOW(),
        '73-04-cd-e5-6f-a0'
    ),
    (
        NULL,
        19.5,
        13.9,
        7.3,
        NOW(),
        '2f-d0-bb-62-61-14'
    ),
    (
        NULL,
        23.8,
        14.5,
        85.2,
        NOW(),
        'a3-4e-5e-38-96-be'
    ),
    (NULL, 3.8, 8.6, 48.7, NOW(), '7b-a0-1d-74-7f-68'),
    (
        NULL,
        85.3,
        65.4,
        68.4,
        NOW(),
        '87-6d-74-ea-b8-d6'
    ),
    (
        NULL,
        59.2,
        47.9,
        74.1,
        NOW(),
        '03-db-e0-03-dd-f2'
    ),
    (
        NULL,
        79.5,
        9.7,
        43.4,
        NOW(),
        '67-8f-75-1a-a2-e0'
    ),
    (
        NULL,
        72.1,
        69.3,
        87.9,
        NOW(),
        '87-f4-a2-f4-26-7f'
    ),
    (
        NULL,
        60.0,
        78.0,
        74.3,
        NOW(),
        '73-04-cd-e5-6f-a0'
    ),
    (
        NULL,
        26.5,
        28.3,
        10.4,
        NOW(),
        '2f-d0-bb-62-61-14'
    ),
    (
        NULL,
        19.8,
        12.5,
        85.2,
        NOW(),
        'a3-4e-5e-38-96-be'
    ),
    (NULL, 5, 12, 50.0, NOW(), '7b-a0-1d-74-7f-68'),
    (NULL, 90, 63, 69, NOW(), '87-6d-74-ea-b8-d6'),
    (NULL, 60, 45, 75, NOW(), '03-db-e0-03-dd-f2'),
    (NULL, 80, 15, 36.4, NOW(), '67-8f-75-1a-a2-e0'),
    (
        NULL,
        72.1,
        69.3,
        87.9,
        NOW(),
        '87-f4-a2-f4-26-7f'
    ),
    (
        NULL,
        35.0,
        91.0,
        70.3,
        NOW(),
        '73-04-cd-e5-6f-a0'
    ),
    (
        NULL,
        46.5,
        9.9,
        17.3,
        NOW(),
        '2f-d0-bb-62-61-14'
    ),
    (
        NULL,
        18.8,
        19.5,
        85.2,
        NOW(),
        'a3-4e-5e-38-96-be'
    ),
    (NULL, 2, 6, 48, NOW(), '7b-a0-1d-74-7f-68'),
    (NULL, 92, 65.4, 69.4, NOW(), '87-6d-74-ea-b8-d6'),
    (
        NULL,
        49.2,
        47.9,
        74.1,
        NOW(),
        '03-db-e0-03-dd-f2'
    ),
    (NULL, 69.5, 11, 40.4, NOW(), '67-8f-75-1a-a2-e0'),
    (NULL, 82.1, 80.3, 85, NOW(), '87-f4-a2-f4-26-7f'),
    (
        NULL,
        45.0,
        77.0,
        69.3,
        NOW(),
        '73-04-cd-e5-6f-a0'
    ),
    (NULL, 33.5, 15, 18, NOW(), '2f-d0-bb-62-61-14'),
    (
        NULL,
        18.8,
        23.5,
        84.2,
        NOW(),
        'a3-4e-5e-38-96-be'
    ),
    (NULL, 9, 6, 49, NOW(), '7b-a0-1d-74-7f-68'),
    (NULL, 81, 65.4, 66.4, NOW(), '87-6d-74-ea-b8-d6'),
    (
        NULL,
        38.2,
        47.9,
        72.1,
        NOW(),
        '03-db-e0-03-dd-f2'
    ),
    (NULL, 78.5, 11, 40.4, NOW(), '67-8f-75-1a-a2-e0'),
    (NULL, 88.1, 80.3, 85, NOW(), '87-f4-a2-f4-26-7f'),
    (
        NULL,
        58.0,
        89.0,
        74.3,
        NOW(),
        '73-04-cd-e5-6f-a0'
    ),
    (
        NULL,
        19.5,
        13.9,
        7.3,
        NOW(),
        '2f-d0-bb-62-61-14'
    ),
    (
        NULL,
        23.8,
        14.5,
        85.2,
        NOW(),
        'a3-4e-5e-38-96-be'
    ),
    (NULL, 3.8, 8.6, 48.7, NOW(), '7b-a0-1d-74-7f-68'),
    (
        NULL,
        85.3,
        65.4,
        68.4,
        NOW(),
        '87-6d-74-ea-b8-d6'
    ),
    (
        NULL,
        59.2,
        47.9,
        74.1,
        NOW(),
        '03-db-e0-03-dd-f2'
    ),
    (
        NULL,
        79.5,
        9.7,
        43.4,
        NOW(),
        '67-8f-75-1a-a2-e0'
    ),
    (
        NULL,
        72.1,
        69.3,
        87.9,
        NOW(),
        '87-f4-a2-f4-26-7f'
    ),
    (
        NULL,
        60.0,
        78.0,
        74.3,
        NOW(),
        '73-04-cd-e5-6f-a0'
    ),
    (
        NULL,
        26.5,
        28.3,
        10.4,
        NOW(),
        '2f-d0-bb-62-61-14'
    ),
    (
        NULL,
        19.8,
        12.5,
        85.2,
        NOW(),
        'a3-4e-5e-38-96-be'
    ),
    (NULL, 5, 12, 50.0, NOW(), '7b-a0-1d-74-7f-68'),
    (NULL, 90, 63, 69, NOW(), '87-6d-74-ea-b8-d6'),
    (NULL, 60, 45, 75, NOW(), '03-db-e0-03-dd-f2'),
    (NULL, 80, 15, 36.4, NOW(), '67-8f-75-1a-a2-e0'),
    (
        NULL,
        72.1,
        69.3,
        87.9,
        NOW(),
        '87-f4-a2-f4-26-7f'
    );