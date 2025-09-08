# SCHEMA

## Billing Addresses

```sql
CREATE TABLE `billing_addresses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint DEFAULT NULL,
  `full_name` tinytext NOT NULL,
  `address_line` tinytext NOT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` int NOT NULL,
  `country` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoices_id` (`invoice_id`),
  CONSTRAINT `billing_addresses_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`)
)
```

## Discounts

```sql
CREATE TABLE `discounts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `discount_percentage` int NOT NULL,
  `valid_from` date NOT NULL,
  `expires_at` date NOT NULL,
  PRIMARY KEY (`id`)
)
```

## Genres

```sql
CREATE TABLE `genres` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` tinytext NOT NULL,
  PRIMARY KEY (`id`)
)
```

## Invoices

```sql
CREATE TABLE `invoices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `discount_id` bigint DEFAULT NULL,
  `total_amount` int NOT NULL COMMENT '# in cents',
  `currency` char(3) NOT NULL DEFAULT 'EUR',
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_provider` tinytext,
  `created_at` datetime NOT NULL,
  `completed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `discount_id` (`discount_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`id`)
)
```

## Media

```sql
CREATE TABLE `media` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `videogame_id` bigint NOT NULL,
  `media_url` text NOT NULL,
  `type` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `videogame_id` (`videogame_id`),
  CONSTRAINT `media_ibfk_1` FOREIGN KEY (`videogame_id`) REFERENCES `videogames` (`id`)
)
```

## Platforms

```sql
CREATE TABLE `platforms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` tinytext NOT NULL,
  PRIMARY KEY (`id`)
)
```

## Videogames

```sql
CREATE TABLE `videogames` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `name` tinytext NOT NULL,
  `description` text NOT NULL,
  `price` decimal(5,2) NOT NULL COMMENT '# price in cents',
  `promo_price` decimal(5,2) DEFAULT NULL,
  `developer` tinytext NOT NULL,
  `release_date` datetime NOT NULL,
  `image_url` text NOT NULL,
  `quantity` int NOT NULL,
  `vote` decimal(3,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_UNIQUE` (`slug`)
)
```

## Invoice Videogame (Join table)

```sql
CREATE TABLE `invoice_videogame` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint NOT NULL,
  `videogame_id` bigint NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `videogame_id` (`videogame_id`),
  CONSTRAINT `invoice_videogame_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`),
  CONSTRAINT `invoice_videogame_ibfk_2` FOREIGN KEY (`videogame_id`) REFERENCES `videogames` (`id`)
)
```

## Platform Videogame (Join table)

```sql
CREATE TABLE `platform_videogame` (
  `videogame_id` bigint NOT NULL,
  `platform_id` bigint NOT NULL,
  PRIMARY KEY (`videogame_id`,`platform_id`),
  KEY `platform_id` (`platform_id`),
  CONSTRAINT `platform_videogame_ibfk_1` FOREIGN KEY (`videogame_id`) REFERENCES `videogames` (`id`),
  CONSTRAINT `platform_videogame_ibfk_2` FOREIGN KEY (`platform_id`) REFERENCES `platforms` (`id`)
)
```

## Videogame Genre (Join table)

```sql
CREATE TABLE `videogame_genre` (
  `videogame_id` bigint NOT NULL,
  `genre_id` bigint NOT NULL,
  PRIMARY KEY (`videogame_id`,`genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `videogame_genre_ibfk_1` FOREIGN KEY (`videogame_id`) REFERENCES `videogames` (`id`),
  CONSTRAINT `videogame_genre_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`)
)
```
