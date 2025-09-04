-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cloudgames
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `billing_addresses`
--

DROP TABLE IF EXISTS `billing_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billing_addresses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `invoices_id` bigint NOT NULL,
  `full_name` tinytext NOT NULL,
  `address_line` tinytext NOT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` tinytext NOT NULL,
  `country` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoices_id` (`invoices_id`),
  CONSTRAINT `billing_addresses_ibfk_1` FOREIGN KEY (`invoices_id`) REFERENCES `invoices` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billing_addresses`
--

LOCK TABLES `billing_addresses` WRITE;
/*!40000 ALTER TABLE `billing_addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `billing_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discounts`
--

DROP TABLE IF EXISTS `discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discounts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `discount_percentage` int NOT NULL COMMENT '# in cents',
  `valid_from` date NOT NULL,
  `expires_at` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discounts`
--

LOCK TABLES `discounts` WRITE;
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
INSERT INTO `discounts` VALUES (1,'WELCOME5',5,'2025-01-01','2025-12-31'),(2,'GAMER10',10,'2025-08-01','2025-09-30'),(3,'BLACKFRIDAY20',20,'2024-11-20','2024-11-30'),(4,'SUMMER15',15,'2025-06-01','2025-08-31'),(5,'SPRING7',7,'2025-03-01','2025-04-30'),(6,'XMAS25',25,'2025-12-01','2025-12-31'),(7,'NEWYEAR30',30,'2025-12-30','2026-01-05'),(8,'RETRO8',8,'2025-07-01','2025-09-15'),(9,'FPS12',12,'2024-09-01','2024-10-01'),(10,'RPG18',18,'2025-09-01','2025-10-15');
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` tinytext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (1,'Horror'),(2,'Action'),(3,'Adventure'),(4,'RPG'),(5,'Strategy'),(6,'Sports'),(7,'Racing'),(8,'Simulation'),(9,'Puzzle'),(10,'Fighting');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_videogame`
--

DROP TABLE IF EXISTS `invoice_videogame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_videogame` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint NOT NULL,
  `videogame_id` bigint NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` int NOT NULL COMMENT '# cents snapshot',
  PRIMARY KEY (`id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `videogame_id` (`videogame_id`),
  CONSTRAINT `invoice_videogame_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`),
  CONSTRAINT `invoice_videogame_ibfk_2` FOREIGN KEY (`videogame_id`) REFERENCES `videogames` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_videogame`
--

LOCK TABLES `invoice_videogame` WRITE;
/*!40000 ALTER TABLE `invoice_videogame` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice_videogame` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `discount_id` bigint NOT NULL,
  `total_amount` int NOT NULL COMMENT '# in cents',
  `currency` char(3) NOT NULL DEFAULT 'EUR',
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_provider` tinytext,
  `created_at` datetime NOT NULL,
  `completed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `discount_id` (`discount_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `videogame_id` bigint NOT NULL,
  `media_url` text NOT NULL,
  `type` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `videogame_id` (`videogame_id`),
  CONSTRAINT `media_ibfk_1` FOREIGN KEY (`videogame_id`) REFERENCES `videogames` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=169 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
INSERT INTO `media` VALUES (1,1,'https://gaming-cdn.com/images/products/414/screenshot/no-man-s-sky-pc-mac-steam-wallpaper-1-big.jpg?v=1756388676','img'),(2,1,'https://gaming-cdn.com/images/products/414/screenshot/no-man-s-sky-pc-mac-steam-wallpaper-4-thumbv2.jpg?v=1756388676','img'),(3,1,'https://gaming-cdn.com/images/products/414/screenshot/no-man-s-sky-pc-mac-steam-wallpaper-3-thumbv2.jpg?v=1756388676','img'),(4,1,'https://gaming-cdn.com/images/products/414/screenshot/no-man-s-sky-pc-mac-steam-wallpaper-5-thumbv2.jpg?v=1756388676','img'),(5,1,'https://gaming-cdn.com/images/products/414/screenshot/no-man-s-sky-pc-mac-steam-wallpaper-2-thumbv2.jpg?v=1756388676','img'),(6,1,'https://www.youtube.com/embed/aCgWabJssVI','video'),(7,2,'https://gaming-cdn.com/images/products/442/screenshot/minecraft-java-bedrock-edition-java-bedrock-edition-pc-gioco-wallpaper-1-big.jpg?v=1716387513','img'),(8,2,'https://gaming-cdn.com/images/products/442/screenshot/minecraft-java-bedrock-edition-java-bedrock-edition-pc-gioco-wallpaper-2-thumbv2.jpg?v=1716387513','img'),(9,2,'https://gaming-cdn.com/images/products/442/screenshot/minecraft-java-bedrock-edition-java-bedrock-edition-pc-gioco-wallpaper-3.jpg?v=1716387513','img'),(10,2,'https://gaming-cdn.com/images/products/442/screenshot/minecraft-java-bedrock-edition-java-bedrock-edition-pc-gioco-wallpaper-4.jpg?v=1716387513','img'),(11,2,'https://gaming-cdn.com/images/products/442/screenshot/minecraft-java-bedrock-edition-java-bedrock-edition-pc-gioco-wallpaper-5.jpg?v=1716387513','img'),(12,2,'https://www.youtube.com/embed/MmB9b5njVbA','video'),(13,3,'https://gaming-cdn.com/images/products/4211/screenshot/grand-theft-auto-v-enhanced-pc-rockstar-wallpaper-1-big.jpg?v=1750336095','img'),(14,3,'https://gaming-cdn.com/images/products/4211/screenshot/grand-theft-auto-v-enhanced-pc-rockstar-wallpaper-2.jpg?v=1750336095','img'),(15,3,'https://gaming-cdn.com/images/products/4211/screenshot/grand-theft-auto-v-enhanced-pc-rockstar-wallpaper-3.jpg?v=1750336095','img'),(16,3,'https://gaming-cdn.com/images/products/4211/screenshot/grand-theft-auto-v-enhanced-pc-rockstar-wallpaper-4.jpg?v=1750336095','img'),(17,3,'https://gaming-cdn.com/images/products/4211/screenshot/grand-theft-auto-v-enhanced-pc-rockstar-wallpaper-5.jpg?v=1750336095','img'),(18,3,'https://www.youtube.com/embed/QkkoHAzjnUs','video'),(19,4,'https://gaming-cdn.com/images/products/15381/screenshot/borderlands-4-pc-steam-wallpaper-1-big.jpg?v=1755588316','img'),(20,4,'https://gaming-cdn.com/images/products/15381/screenshot/borderlands-4-pc-steam-wallpaper-2.jpg?v=1755588316','img'),(21,4,'https://gaming-cdn.com/images/products/15381/screenshot/borderlands-4-pc-steam-wallpaper-3.jpg?v=1755588316','img'),(22,4,'https://gaming-cdn.com/images/products/15381/screenshot/borderlands-4-pc-steam-wallpaper-4.jpg?v=1755588316','img'),(23,4,'https://gaming-cdn.com/images/products/15381/screenshot/borderlands-4-pc-steam-wallpaper-5.jpg?v=1755588316','img'),(24,4,'https://www.youtube.com/embed/onY6y4NZ-t4','video'),(25,5,'https://gaming-cdn.com/images/products/19631/screenshot/tiny-bookshop-pc-mac-steam-wallpaper-1-big.jpg?v=1756883267','img'),(26,5,'https://gaming-cdn.com/images/products/19631/screenshot/tiny-bookshop-pc-mac-steam-wallpaper-2.jpg?v=1756883267','img'),(27,5,'https://gaming-cdn.com/images/products/19631/screenshot/tiny-bookshop-pc-mac-steam-wallpaper-3.jpg?v=1756883267','img'),(28,5,'https://gaming-cdn.com/images/products/19631/screenshot/tiny-bookshop-pc-mac-steam-wallpaper-4.jpg?v=1756883267','img'),(29,5,'https://gaming-cdn.com/images/products/19631/screenshot/tiny-bookshop-pc-mac-steam-wallpaper-5.jpg?v=1756883267','img'),(30,5,'https://www.youtube.com/embed/L9NsYX6sLeg','video'),(31,6,'https://gaming-cdn.com/images/products/17015/screenshot/clair-obscur-expedition-33-pc-steam-wallpaper-1-big.jpg?v=1750336145','img'),(32,6,'https://gaming-cdn.com/images/products/17015/screenshot/clair-obscur-expedition-33-pc-steam-wallpaper-2.jpg?v=1750336145','img'),(33,6,'https://gaming-cdn.com/images/products/17015/screenshot/clair-obscur-expedition-33-pc-steam-wallpaper-3.jpg?v=1750336145','img'),(34,6,'https://gaming-cdn.com/images/products/17015/screenshot/clair-obscur-expedition-33-pc-steam-wallpaper-4.jpg?v=1750336145','img'),(35,6,'https://gaming-cdn.com/images/products/17015/screenshot/clair-obscur-expedition-33-pc-steam-wallpaper-5.jpg?v=1750336145','img'),(36,6,'https://www.youtube.com/embed/-qgOZDRDynw','video'),(37,7,'https://gaming-cdn.com/images/products/9575/screenshot/helldivers-2-pc-gioco-steam-europe-us-canada-wallpaper-1-big.jpg?v=1732563825','img'),(38,7,'https://gaming-cdn.com/images/products/9575/screenshot/helldivers-2-pc-gioco-steam-europe-us-canada-wallpaper-2.jpg?v=1732563825','img'),(39,7,'https://gaming-cdn.com/images/products/9575/screenshot/helldivers-2-pc-gioco-steam-europe-us-canada-wallpaper-3.jpg?v=1732563825','img'),(40,7,'https://gaming-cdn.com/images/products/9575/screenshot/helldivers-2-pc-gioco-steam-europe-us-canada-wallpaper-4.jpg?v=1732563825','img'),(41,7,'https://gaming-cdn.com/images/products/9575/screenshot/helldivers-2-pc-gioco-steam-europe-us-canada-wallpaper-5.jpg?v=1732563825','img'),(42,7,'https://www.youtube.com/embed/Aiz0qwdoCXU','video'),(43,8,'https://gaming-cdn.com/images/products/3098/screenshot/assetto-corsa-ultimate-edition-ultimate-edition-pc-gioco-steam-wallpaper-1-big.jpg?v=1715265138','img'),(44,8,'https://gaming-cdn.com/images/products/3098/screenshot/assetto-corsa-ultimate-edition-ultimate-edition-pc-gioco-steam-wallpaper-2.jpg?v=1715265138','img'),(45,8,'https://gaming-cdn.com/images/products/3098/screenshot/assetto-corsa-ultimate-edition-ultimate-edition-pc-gioco-steam-wallpaper-3.jpg?v=1715265138','img'),(46,8,'https://gaming-cdn.com/images/products/3098/screenshot/assetto-corsa-ultimate-edition-ultimate-edition-pc-gioco-steam-wallpaper-4.jpg?v=1715265138','img'),(47,8,'https://gaming-cdn.com/images/products/3098/screenshot/assetto-corsa-ultimate-edition-ultimate-edition-pc-gioco-steam-wallpaper-5.jpg?v=1715265138','img'),(48,8,'https://www.youtube.com/embed/-6X29LcfWsQ','video'),(49,9,'https://gaming-cdn.com/images/products/20161/screenshot/kingdom-come-deliverance-ii-legacy-of-the-forge-pc-steam-wallpaper-1-thumbv2.jpg?v=1756903561','img'),(50,9,'https://gaming-cdn.com/images/products/20161/screenshot/kingdom-come-deliverance-ii-legacy-of-the-forge-pc-steam-wallpaper-2.jpg?v=1756903561','img'),(51,9,'https://gaming-cdn.com/images/products/20161/screenshot/kingdom-come-deliverance-ii-legacy-of-the-forge-pc-steam-wallpaper-3.jpg?v=1756903561','img'),(52,9,'https://gaming-cdn.com/images/products/20161/screenshot/kingdom-come-deliverance-ii-legacy-of-the-forge-pc-steam-wallpaper-4.jpg?v=1756903561','img'),(53,9,'https://www.youtube.com/embed/ju8R8gwD-Vg','video'),(54,10,'https://gaming-cdn.com/images/products/8855/screenshot/lies-of-p-pc-gioco-steam-wallpaper-1-big.jpg?v=1734358617','img'),(55,10,'https://gaming-cdn.com/images/products/8855/screenshot/lies-of-p-pc-gioco-steam-wallpaper-2.jpg?v=1734358617','img'),(56,10,'https://gaming-cdn.com/images/products/8855/screenshot/lies-of-p-pc-gioco-steam-wallpaper-3.jpg?v=1734358617','img'),(57,10,'https://gaming-cdn.com/images/products/8855/screenshot/lies-of-p-pc-gioco-steam-wallpaper-4.jpg?v=1734358617','img'),(58,10,'https://gaming-cdn.com/images/products/8855/screenshot/lies-of-p-pc-gioco-steam-wallpaper-5.jpg?v=1734358617','img'),(59,10,'https://www.youtube.com/embed/kXZoKdr-xeo?si=2jebFzDiPiAJo0BQ','video'),(60,11,'https://gaming-cdn.com/images/products/184/screenshot/batman-arkham-origins-pc-gioco-steam-wallpaper-1-big.jpg?v=1683619090','img'),(61,11,'https://gaming-cdn.com/images/products/184/screenshot/batman-arkham-origins-pc-gioco-steam-wallpaper-2.jpg?v=1683619090','img'),(62,11,'https://gaming-cdn.com/images/products/184/screenshot/batman-arkham-origins-pc-gioco-steam-wallpaper-3.jpg?v=1683619090','img'),(63,11,'https://gaming-cdn.com/images/products/184/screenshot/batman-arkham-origins-pc-gioco-steam-wallpaper-4.jpg?v=1683619090','img'),(64,11,'https://gaming-cdn.com/images/products/184/screenshot/batman-arkham-origins-pc-gioco-steam-wallpaper-5.jpg?v=1683619090','img'),(65,11,'https://www.youtube.com/embed/9pnK8akbd2M','video'),(66,12,'https://gaming-cdn.com/images/products/16993/screenshot/farming-simulator-25-pc-mac-gioco-steam-europe-us-canada-wallpaper-1-big.jpg?v=1746786479','img'),(67,12,'https://gaming-cdn.com/images/products/16993/screenshot/farming-simulator-25-pc-mac-gioco-steam-europe-us-canada-wallpaper-2.jpg?v=1746786479','img'),(68,12,'https://gaming-cdn.com/images/products/16993/screenshot/farming-simulator-25-pc-mac-gioco-steam-europe-us-canada-wallpaper-3.jpg?v=1746786479','img'),(69,12,'https://gaming-cdn.com/images/products/16993/screenshot/farming-simulator-25-pc-mac-gioco-steam-europe-us-canada-wallpaper-4.jpg?v=1746786479','img'),(70,12,'https://gaming-cdn.com/images/products/16993/screenshot/farming-simulator-25-pc-mac-gioco-steam-europe-us-canada-wallpaper-5.jpg?v=1746786479','img'),(71,12,'https://www.youtube.com/embed/IahVluSZrGw','video'),(72,13,'https://gaming-cdn.com/images/products/18920/screenshot/lost-soul-aside-deluxe-edition-pc-steam-wallpaper-1-big.jpg?v=1756474122','img'),(73,13,'https://gaming-cdn.com/images/products/18920/screenshot/lost-soul-aside-deluxe-edition-pc-steam-wallpaper-2.jpg?v=1756474122','img'),(74,13,'https://gaming-cdn.com/images/products/18920/screenshot/lost-soul-aside-deluxe-edition-pc-steam-wallpaper-3.jpg?v=1756474122','img'),(75,13,'https://gaming-cdn.com/images/products/18920/screenshot/lost-soul-aside-deluxe-edition-pc-steam-wallpaper-4.jpg?v=1756474122','img'),(76,13,'https://gaming-cdn.com/images/products/18920/screenshot/lost-soul-aside-deluxe-edition-pc-steam-wallpaper-5.jpg?v=1756474122','img'),(77,13,'https://www.youtube.com/embed/GRhg0RYYsa0','video'),(78,14,'https://gaming-cdn.com/images/products/9093/screenshot/ghost-of-tsushima-director-s-cut-pc-gioco-steam-wallpaper-1-big.jpg?v=1715876608','img'),(79,14,'https://gaming-cdn.com/images/products/9093/screenshot/ghost-of-tsushima-director-s-cut-pc-gioco-steam-wallpaper-2.jpg?v=1715876608','img'),(80,14,'https://gaming-cdn.com/images/products/9093/screenshot/ghost-of-tsushima-director-s-cut-pc-gioco-steam-wallpaper-3.jpg?v=1715876608','img'),(81,14,'https://gaming-cdn.com/images/products/9093/screenshot/ghost-of-tsushima-director-s-cut-pc-gioco-steam-wallpaper-4.jpg?v=1715876608','img'),(82,14,'https://gaming-cdn.com/images/products/9093/screenshot/ghost-of-tsushima-director-s-cut-pc-gioco-steam-wallpaper-5.jpg?v=1715876608','img'),(83,14,'https://www.youtube.com/embed/iqysmS4lxwQ','video'),(84,15,'https://gaming-cdn.com/images/products/5653/screenshot/red-dead-redemption-2-ultimate-edition-ultimate-edition-pc-gioco-rockstar-wallpaper-1-big.jpg?v=1745571744','img'),(85,15,'https://gaming-cdn.com/images/products/5653/screenshot/red-dead-redemption-2-ultimate-edition-ultimate-edition-pc-gioco-rockstar-wallpaper-2.jpg?v=1745571744','img'),(86,15,'https://gaming-cdn.com/images/products/5653/screenshot/red-dead-redemption-2-ultimate-edition-ultimate-edition-pc-gioco-rockstar-wallpaper-3.jpg?v=1745571744','img'),(87,15,'https://gaming-cdn.com/images/products/5653/screenshot/red-dead-redemption-2-ultimate-edition-ultimate-edition-pc-gioco-rockstar-wallpaper-4.jpg?v=1745571744','img'),(88,15,'https://gaming-cdn.com/images/products/5653/screenshot/red-dead-redemption-2-ultimate-edition-ultimate-edition-pc-gioco-rockstar-wallpaper-5.jpg?v=1745571744','img'),(89,15,'https://www.youtube.com/embed/gmA6MrX81z4','video');
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform_videogame`
--

DROP TABLE IF EXISTS `platform_videogame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platform_videogame` (
  `videogame_id` bigint NOT NULL,
  `platform_id` bigint NOT NULL,
  PRIMARY KEY (`videogame_id`,`platform_id`),
  KEY `platform_id` (`platform_id`),
  CONSTRAINT `platform_videogame_ibfk_1` FOREIGN KEY (`videogame_id`) REFERENCES `videogames` (`id`),
  CONSTRAINT `platform_videogame_ibfk_2` FOREIGN KEY (`platform_id`) REFERENCES `platforms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform_videogame`
--

LOCK TABLES `platform_videogame` WRITE;
/*!40000 ALTER TABLE `platform_videogame` DISABLE KEYS */;
INSERT INTO `platform_videogame` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),(1,2),(2,2),(3,2),(4,2),(6,2),(7,2),(8,2),(9,2),(10,2),(11,2),(12,2),(13,2),(14,2),(15,2),(1,3),(2,3),(3,3),(4,3),(6,3),(8,3),(9,3),(10,3),(11,3),(12,3),(15,3),(2,4),(12,4);
/*!40000 ALTER TABLE `platform_videogame` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platforms`
--

DROP TABLE IF EXISTS `platforms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platforms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` tinytext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platforms`
--

LOCK TABLES `platforms` WRITE;
/*!40000 ALTER TABLE `platforms` DISABLE KEYS */;
INSERT INTO `platforms` VALUES (1,'PC'),(2,'PlayStation'),(3,'Xbox'),(4,'Nintendo Switch');
/*!40000 ALTER TABLE `platforms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videogame_genre`
--

DROP TABLE IF EXISTS `videogame_genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videogame_genre` (
  `videogame_id` bigint NOT NULL,
  `genre_id` bigint NOT NULL,
  PRIMARY KEY (`videogame_id`,`genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `videogame_genre_ibfk_1` FOREIGN KEY (`videogame_id`) REFERENCES `videogames` (`id`),
  CONSTRAINT `videogame_genre_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videogame_genre`
--

LOCK TABLES `videogame_genre` WRITE;
/*!40000 ALTER TABLE `videogame_genre` DISABLE KEYS */;
INSERT INTO `videogame_genre` VALUES (10,1),(3,2),(4,2),(7,2),(10,2),(11,2),(13,2),(14,2),(15,2),(1,3),(2,3),(3,3),(9,3),(11,3),(14,3),(15,3),(4,4),(6,4),(9,4),(13,4),(6,5),(8,7),(1,8),(2,8),(5,8),(8,8),(12,8);
/*!40000 ALTER TABLE `videogame_genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videogames`
--

DROP TABLE IF EXISTS `videogames`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videogames` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` tinytext NOT NULL,
  `description` text NOT NULL,
  `price` decimal(5,2) NOT NULL COMMENT '# price in cents',
  `promo_price` decimal(5,2) DEFAULT NULL,
  `developer` tinytext NOT NULL,
  `release_date` datetime NOT NULL,
  `image_url` text NOT NULL,
  `quantity` int NOT NULL,
  `vote` decimal(3,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videogames`
--

LOCK TABLES `videogames` WRITE;
/*!40000 ALTER TABLE `videogames` DISABLE KEYS */;
INSERT INTO `videogames` VALUES (1,'No Man\'s Sky','No Man\'s Sky per PC è un gioco di sopravvivenza azione-avventura in cui il giocatore assume la forma di un umanoide alieno schiantato al suolo che riceve il minimo di cui ha bisogno per sopravvivere e svilupparsi. Dotato di un multi-tool, il giocatore può seguire i consigli di un\'entità chiamata Atlas, che di volta in volta si presenta sullo schermo. Questi consigli guidano i giocatori attraverso un percorso prestabilito, offrendo loro molte opportunità per estrarre risorse, fare battaglie o commerciare e fare squadra con compagni di gioco o alieni (questi ultimi sono generati dagli algoritmi dei server in base alla necessità, proprio come le zone più lontane del cosmo). Il modo migliore per giocare è iniziare da solo, costruendo le navi e i corrieri di cui hai bisogno per continuare il tuo viaggio quando ne senti la necessità. Scopri quanto puoi viaggiare lontano, commerciando, estraendo risorse e, contemporaneamente, combattendo.',59.99,19.99,'Hello Games','2016-08-12 00:00:00','https://gaming-cdn.com/images/products/414/616x353/no-man-s-sky-pc-mac-steam-cover.jpg?v=1756388676',120,4.70),(2,'Minecraft: Java & Bedrock Edition','La premessa del gioco è estremamente semplice: si arriva al gioco con nient\'altro che le mani e un inventario limitato. Devi scavare per raccogliere materiali che poi usi per creare strumenti e costruire case e altri edifici. Le risorse vanno dalle più comuni ad altre molto rare, e spesso le materie prime più rare e preziose sono le più difficili da raggiungere, richiedono scavi in profondità e persino la costruzione di tunnel di rinforzo per impedire le inondazioni o la caduta di rocce. Non esiste un arco narrativo, in quanto tale: dipende interamente da te e da ciò che vuoi ottenere. Puoi costruire città o una dimora rurale, allevare pecore o andare a pescare. Il gioco è esattamente quello che tu e la tua immaginazione volete che sia.',29.99,14.99,'Xbox Game Studios','2015-11-19 00:00:00','https://gaming-cdn.com/images/products/442/616x353/minecraft-java-bedrock-edition-java-bedrock-edition-pc-gioco-cover.jpg?v=1716387513',80,4.50),(3,'Grand Theft Auto V Enhanced (Rockstar)','Un giovane truffatore, un rapinatore di banche in pensione e uno spaventoso psicopatico si ritrovano nel mirino degli elementi più discutibili del mondo del crimine, del governo statunitense e dell\'industria dello spettacolo. Per sopravvivere dovranno mettere in atto una serie di audaci colpi in una città spietata dove non possono fidarsi di nessuno, men che meno gli uni degli altri. I giocatori su PC possono trasferire i progressi di gioco della modalità Storia di GTAV e i personaggi e progressi di GTA Online con un trasferimento unico dalla versione classica di GTAV a GTAV Enhanced.',17.99,9.99,'Xbox Game Studios','2011-11-19 00:00:00','https://gaming-cdn.com/images/products/4211/616x353/grand-theft-auto-v-enhanced-pc-rockstar-cover.jpg?v=1750336095',80,4.60),(4,'Borderlands 4','Borderlands 4 è un concentrato di azione, Cacciatori della Cripta e miliardi di armi feroci e letali nello scenario di un nuovo pianeta comandato da uno spietato tiranno. Catapultati su Kairos nei panni di uno dei nuovi Cacciatori della Cripta alla caccia di gloria e ricchezze. Sfrutta potenti abilità d\'azione, personalizza la tua build con accurate specializzazioni e domina i nemici con abilità di movimento dinamiche. Sfuggi all\'opprimente giogo del Cronocustode, uno spietato dittatore che domina il popolo dall\'alto. Ma una catastrofe di proporzioni globali rischia di mettere a repentaglio il suo perfetto Ordine, gettando l\'intero pianeta nel Caos più profondo.',51.99,46.99,'Rockstar North','2025-09-03 00:00:00','https://gaming-cdn.com/images/products/15381/616x353/borderlands-4-pc-steam-cover.jpg?v=1755588316',40,4.60),(5,'Tiny Bookshop','Lasciati tutto alle spalle e apri una piccola libreria vicino al mare in questo gioco gestionale narrativo carinissimo. Riempi la tua piccola libreria con diversi libri e oggetti, aprila vicino paesaggi scenici e avvia la tua libreria di libri usati mentre impari a conoscere le persone del luogo.',19.99,14.99,'neoludic games','2025-08-07 00:00:00','https://gaming-cdn.com/images/products/19631/616x353/tiny-bookshop-pc-mac-steam-cover.jpg?v=1756883267',127,4.30),(6,'Clair Obscur: Expedition 33','Una volta all\'anno, la Pittrice si risveglia e inizia a dipingere sul suo Monolito. Dipinge il numero maledetto. E tutti coloro che hanno più di quell\'età si tramutano in fumo e svaniscono. Anno dopo anno il numero cambia, e altre persone vengono cancellate. Domani la Pittrice si sveglierà e dipingerà il numero \"33\". E domani noi partiremo per la missione finale: distruggere la Pittrice, in modo che non possa più dipingere la morte. Noi siamo la Spedizione 33 Clair Obscur: Expedition 33 è un innovativo GDR a turni con meccaniche di gioco in tempo reale che rendono le battaglie più immersive e coinvolgenti che mai. Esplora un mondo di fantasia ispirato alla Francia della Belle Époque, in cui dovrai affrontare nemici devastanti.',59.99,27.99,'Sandfall interactive','2025-04-24 00:00:00','https://gaming-cdn.com/images/products/17015/616x353/clair-obscur-expedition-33-pc-steam-cover.jpg?v=1750336145',345,4.90),(7,'Helldivers 2','L\'ultima linea di attacco della galassia. Unisciti agli Helldiver per combattere in nome della libertà in una galassia ostile in questo frenetico e feroce sparatutto in terza persona.',39.99,29.99,'Arrowhead Game Studios','2024-02-08 00:00:00','https://gaming-cdn.com/images/products/9575/616x353/helldivers-2-pc-gioco-steam-europe-us-canada-cover.jpg?v=1732563825',345,4.50),(8,'Assetto Corsa Ultimate Edition','Scegli tra 178 dettagliatissimi veicoli (il loro assetto di guida e le loro prestazioni sono realizzate in base a dati e telemetria reali) e 19 circuiti leggendari (tra cui quello di Spa-Francorchamps, Nürburgring-Nordschleife, Laguna Seca e molti altri) con 40 diverse configurazioni di tracciato, tutte ricreate attraverso scansione laser. Lanciati in pista come giocatore singolo o competi con amici online in modalità multigiocatore. Personalizza la tua esperienza di guida regolando le impostazioni di guida e di gara, per ottenere il tuo personale stile guida. Grazie al suo motore fisico avanzato, basato su caratteristiche reali delle auto, questa Ultimate Edition offre un livello di realismo mai provato prima.',19.99,4.99,'Kunos Simulazioni','2014-12-19 00:00:00','https://gaming-cdn.com/images/products/3098/616x353/assetto-corsa-ultimate-edition-ultimate-edition-pc-gioco-steam-cover.jpg?v=1715265138',48,4.50),(9,'Kingdom Come: Deliverance II Gold Edition','Un emozionante GdR d\'azione a mondo aperto incentrato su un\'avvincente trama, ambientato nell\'Europa medievale del XV secolo. Vivi l\'avventura medievale definitiva attraverso gli occhi del giovane Henry, affrontando un\'impresa di proporzioni epiche.',49.99,22.99,'Warhorse Studios','2025-02-04 00:00:00','https://gaming-cdn.com/images/products/17459/616x353/kingdom-come-deliverance-ii-gold-edition-pc-steam-cover.jpg?v=1750336386',234,4.60),(10,'Lies Of P','Siete un burattino creato da Geppetto che rimane intrappolato in una rete di bugie, con mostri inimmaginabili e personaggi inaffidabili che si frappongono tra te e gli eventi che si sono abbattuti sul mondo di Lies of P. Sei stato risvegliato da una voce misteriosa che ti guida attraverso la tormentata città di Krat, un luogo un tempo vivace che è stato avvelenato dalla follia e dalla sete di sangue. Nel nostro soulslike, dovrai adattare te e le tue armi per affrontare orrori indicibili, districare gli insondabili segreti delle élite della città e scegliere se affrontare i problemi con la verità o con le menzogne, per superarli nel viaggio per ritrovare te stesso.',59.99,19.89,'NEOWIZ','2023-09-18 00:00:00','https://gaming-cdn.com/images/products/8855/616x353/lies-of-p-pc-gioco-steam-cover.jpg?v=1734358617',54,4.70),(11,'Batman: Arkham Origins','La Storia di Arkham inizia con Batman: Arkham Origins, che presenta un racconto cruciale che si svolge alla vigilia di Natale quando Batman è perseguitato da otto dei più letali assassini dell’universo DC. I giocatori possono impersonane un giovane Batman ai suoi primi scontri contro i tanti personaggi che cambieranno il suo futuro.',59.99,19.89,'Warner Bros. Interactive Entertainment','2013-10-25 00:00:00','https://gaming-cdn.com/images/products/184/616x353/batman-arkham-origins-pc-gioco-steam-cover.jpg?v=1683619090',234,4.80),(12,'Farming Simulator 25','Farming Simulator 25 vi invita a tuffarvi nella gratificante vita agricola. Scegliete voi se costruire il vostro retaggio da soli o collaborando nel multiplayer: è la vostra fattoria! Una fattoria tutta vostra. Costruite la fattoria tra i fiumi sinuosi e gli storici montacarichi da cereali del Nord America, tra gli specchi d\'acqua dell\'Europa centrale o in un rigoglioso panorama dell\'Asia orientale ricco di risaie accanto a una città portuale dalle mille luci. Coltivate i campi, allevate gli animali, datevi alla silvicoltura e gestite un vero e proprio impero con negozi, produzioni e costruzioni!',59.99,19.89,'Giants Software','2024-11-12 00:00:00','https://gaming-cdn.com/images/products/16993/616x353/farming-simulator-25-pc-mac-gioco-steam-europe-us-canada-cover.jpg?v=1746786479',373,4.50),(13,'Lost Soul Aside Deluxe Edition','Lotta per salvare il tuo mondo. Salva tua sorella. Salva la tua anima.',59.99,19.89,'Ultizero Games','2025-08-29 00:00:00','https://gaming-cdn.com/images/products/18920/616x353/lost-soul-aside-deluxe-edition-pc-steam-cover.jpg?v=1756474122',27,3.90),(14,'Ghost of Tsushima: Director\'s Cut','Ghost of Tsushima per PC è un pluripremiato gioco d\'azione e avventura open world, con una prospettiva per il giocatore in terza persona. È ambientato nell\'antico Giappone feudale, ma i problemi affrontati dal protagonista saranno facilmente compresi dai giocatori occidentali e moderni.',59.99,37.99,'Sucker Punch Productions & Nixxes Software','2024-08-29 00:00:00','https://gaming-cdn.com/images/products/18920/616x353/lost-soul-aside-deluxe-edition-pc-steam-cover.jpg?v=1756474122',127,4.10),(15,'Red Dead Redemption 2','Red Dead Redemption 2 per PC è un gioco d’azione ambientato in un open world in cui il giocatore può vagare liberamente con alcuni elementi che si svolgono in terza persona, altri in modalità di gioco in prima persona. Il giocatore può commettere crimini, ma dovrà però essere pronto a fronteggiare le forze dell\'ordine che vorranno far valere l\'intero peso della legge sul miscredente!',59.99,12.99,'Rockstar Games','2019-12-05 00:00:00','https://gaming-cdn.com/images/products/5679/616x353/red-dead-redemption-2-pc-gioco-rockstar-cover.jpg?v=1713793245',71,4.80);
/*!40000 ALTER TABLE `videogames` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-04 12:37:32
