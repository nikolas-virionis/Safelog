DROP USER IF EXISTS 'safelog_dev'@'localhost';
DROP USER IF EXISTS 'safelog_dev'@'%';

CREATE USER 'safelog_dev'@'%' IDENTIFIED BY 'Safe_Log371$';
GRANT ALL PRIVILEGES ON `safelog`.* TO `safelog_dev`@`%`;

-- docker mysql user
-- CREATE USER 'safelog_dev'@'172.17.0.1' IDENTIFIED BY 'Safe_Log371$';
-- GRANT ALL PRIVILEGES ON `safelog`.* TO 'safelog_dev'@'172.17.0.1';

FLUSH PRIVILEGES;