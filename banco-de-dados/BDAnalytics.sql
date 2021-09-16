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
    cargo enum('admin', 'gestor', 'analista'),
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
    senha varchar(16),
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
        'ExSenha1'
    ),
    (
        NULL,
        'Felipe Cruz',
        'felipe.souza@bandtec.com.br',
        'ExSenha1'
    ),
    (
        NULL,
        'João Pedro Oliveira',
        'joao.soliveira@bandtec.com.br',
        'ExSenha1'
    ),
    (
        NULL,
        'Lucas Teixeira',
        'lucas.teixeira@bandtec.com.br',
        'ExSenha1'
    ),
    (
        NULL,
        'Lucas Mesquita',
        'lucas.msouza@bandtec.com.br',
        'ExSenha1'
    ),
    (
        NULL,
        'Nikolas Virionis',
        'nikolas.virionis@bandtec.com.br',
        'ExSenha1'
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
        'z7t12p$d',
        'Jeffrey Sprecher',
        'jeffrey.sprecher@gmail.com',
        'ExSenha1',
        'admin',
        '203783731',
        NULL
    ),
    (
        '5@w7kjp9',
        'Gilson Finkelsztain',
        'gilson.finkelsztain@gmail.com',
        'ExSenha1',
        'admin',
        '09.346.601/0001-25',
        NULL
    ),
    (
        'puaga9x9',
        'Raymond E. Miller',
        'raymond.miller@gmail.com',
        'ExSenha1',
        'gestor',
        '203783731',
        NULL
    ),
    (
        'f6lj@sb#',
        'Kauã Rodrigues Pinto',
        'kaua.rodrigues@gmail.com',
        'ExSenha1',
        'gestor',
        '09.346.601/0001-25',
        NULL
    ),
    (
        'tbzgo0ye',
        'Andrew K. Hutson',
        'andrew.hutson@gmail.com',
        'ExSenha1',
        'gestor',
        '203783731',
        NULL
    ),
    (
        'l1kaah&d',
        'Julia Ferreira Pinto',
        'julia.ferreira@gmail.com',
        'ExSenha1',
        'gestor',
        '09.346.601/0001-25',
        NULL
    ),
    (
        'mhbawue#',
        'Harvey M. Knudsen',
        'harvey.knudsen@gmail.com',
        'ExSenha1',
        'analista',
        '203783731',
        NULL
    ),
    (
        'c@bz9tyf',
        'Eduardo Pereira Azevedo',
        'eduardo.azevedo@gmail.com',
        'ExSenha1',
        'analista',
        '09.346.601/0001-25',
        NULL
    ),
    (
        '3%u8w6%r',
        'Laura E. Meade',
        'laura.meade@gmail.com',
        'ExSenha1',
        'analista',
        '203783731',
        NULL
    ),
    (
        'sosbh18u',
        'Douglas Sousa Dias',
        'douglas.dias@gmail.com',
        'ExSenha1',
        'analista',
        '09.346.601/0001-25',
        NULL
    ),
    (
        'za5#$3bm',
        'Pamela T. Lennox',
        'pamela.lennox@gmail.com',
        'ExSenha1',
        'analista',
        '203783731',
        NULL
    ),
    (
        'ric&%j6#',
        'Júlio Sousa Azevedo',
        'julio.azevedo@gmail.com',
        'ExSenha1',
        'analista',
        '09.346.601/0001-25',
        NULL
    ),
    (
        'cds9rh4y',
        'Susan K. Adams',
        'susan.adams@gmail.com',
        'ExSenha1',
        'analista',
        '203783731',
        NULL
    ),
    (
        '62#nea7w',
        'Nicole Silva Gomes',
        'nicole.gomes@gmail.com',
        'ExSenha1',
        'analista',
        '09.346.601/0001-25',
        NULL
    );

INSERT INTO
    contato
VALUES
    ('z7t12p$d', 1, '2568647004', 1),
    ('5@w7kjp9', 1, '2435716496', 1),
    ('puaga9x9', 1, '9737304111', 1),
    ('puaga9x9', 2, 'raymond.miller@gmail.com', 3),
    ('f6lj@sb#', 1, '2435716496', 1),
    ('f6lj@sb#', 2, 'kaua.rodrigues@gmail.com', 3),
    ('tbzgo0ye', 1, '2565025835', 1),
    ('tbzgo0ye', 2, 'andrew.hutson@gmail.com', 3),
    ('l1kaah&d', 1, '4786956231', 1),
    ('l1kaah&d', 2, '4786956231', 2),
    ('mhbawue#', 1, 'harvey.knudsen@gmail.com', 3),
    ('c@bz9tyf', 1, '2430765871', 1),
    ('c@bz9tyf', 2, '2430765871', 2),
    ('c@bz9tyf', 3, 'eduardo.azevedo@gmail.com', 3),
    ('3%u8w6%r', 1, '8018369067', 1),
    ('3%u8w6%r', 2, '8018369067', 2),
    ('3%u8w6%r', 3, 'laura.meade@gmail.com', 3),
    ('sosbh18u', 1, '3180422529', 1),
    ('za5#$3bm', 1, '8305786042', 1),
    ('za5#$3bm', 2, '8305786042', 2),
    ('za5#$3bm', 1, 'pamela.lennox@gmail.com', 3),
    ('ric&%j6#', 1, '1137503889', 1),
    ('ric&%j6#', 2, '1137503889', 2),
    ('ric&%j6#', 3, 'julio.azevedo@gmail.com', 3),
    ('cds9rh4y', 1, '7064230183', 1),
    ('cds9rh4y', 2, '7064230183', 2),
    ('cds9rh4y', 3, 'susan.adams@gmail.com', 3),
    ('62#nea7w', 1, '4748883483', 1),
    ('62#nea7w', 2, '4748883483', 2),
    ('62#nea7w', 3, 'nicole.gomes@gmail.com', 3);

INSERT INTO
    maquina
VALUES
    (
        '73-04-cd-e5-6f-a0',
        'Server1',
        'ExSenha1',
        '203783731'
    ),
    (
        '2f-d0-bb-62-61-14',
        'Server2',
        'ExSenha1',
        '203783731'
    ),
    (
        'a3-4e-5e-38-96-be',
        'Server3',
        'ExSenha1',
        '203783731'
    ),
    (
        '7b-a0-1d-74-7f-68',
        'Server4',
        'ExSenha1',
        '203783731'
    ),
    (
        '87-6d-74-ea-b8-d6',
        'Servidor1',
        'ExSenha1',
        '09.346.601/0001-25'
    ),
    (
        '03-db-e0-03-dd-f2',
        'Servidor2',
        'ExSenha1',
        '09.346.601/0001-25'
    ),
    (
        '67-8f-75-1a-a2-e0',
        'Servidor3',
        'ExSenha1',
        '09.346.601/0001-25'
    ),
    (
        '87-f4-a2-f4-26-7f',
        'Servidor4',
        'ExSenha1',
        '09.346.601/0001-25'
    );

INSERT INTO
    usuario_maquina
VALUES
    (NULL, 'mhbawue#', '73-04-cd-e5-6f-a0'),
    (NULL, 'za5#$3bm', '73-04-cd-e5-6f-a0'),
    (NULL, '3%u8w6%r', '2f-d0-bb-62-61-14'),
    (NULL, 'cds9rh4y', '2f-d0-bb-62-61-14'),
    (NULL, 'mhbawue#', 'a3-4e-5e-38-96-be'),
    (NULL, '3%u8w6%r', 'a3-4e-5e-38-96-be'),
    (NULL, 'za5#$3bm', '7b-a0-1d-74-7f-68'),
    (NULL, 'cds9rh4y', '7b-a0-1d-74-7f-68'),
    (NULL, 'c@bz9tyf', '87-6d-74-ea-b8-d6'),
    (NULL, 'ric&%j6#', '87-6d-74-ea-b8-d6'),
    (NULL, 'sosbh18u', '03-db-e0-03-dd-f2'),
    (NULL, '62#nea7w', '03-db-e0-03-dd-f2'),
    (NULL, 'c@bz9tyf', '67-8f-75-1a-a2-e0'),
    (NULL, 'sosbh18u', '67-8f-75-1a-a2-e0'),
    (NULL, 'ric&%j6#', '87-f4-a2-f4-26-7f'),
    (NULL, '62#nea7w', '87-f4-a2-f4-26-7f');