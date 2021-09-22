CREATE USER 'safelog_dev' @'localhost' IDENTIFIED BY 'Safe_Log371$';

GRANT ALL PRIVILEGES ON `safelog_analytics`.* TO `safelog_dev` @`localhost`;

FLUSH PRIVILEGES;