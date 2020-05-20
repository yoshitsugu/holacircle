CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `client_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_circle` tinyint(1) NOT NULL DEFAULT '0',
  `purpose` text NOT NULL,
  `domains` text NOT NULL,
  `accountabilities` text NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_role_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
