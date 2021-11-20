CREATE USER 'safelog_dev' @'localhost' IDENTIFIED BY 'Safe_Log371$';
GRANT ALL PRIVILEGES ON `safelog`.* TO `safelog_dev` @`localhost`;

-- docker mysql user
CREATE USER 'safelog_dev'@'172.31.25.218' IDENTIFIED BY 'Safe_Log371$';
GRANT ALL PRIVILEGES ON `safelog`.* TO 'safelog_dev'@'172.31.25.218';

FLUSH PRIVILEGES;