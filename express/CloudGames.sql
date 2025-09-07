CREATE DATABASE  IF NOT EXISTS `db-videogames` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db-videogames`;
-- MySQL dump 10.13  Distrib 8.0.42, for macos15 (arm64)
--
-- Host: localhost    Database: db-videogames
-- ------------------------------------------------------
-- Server version	8.0.42

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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=289 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
INSERT INTO `media` VALUES (1,1,'https://gaming-cdn.com/images/products/414/screenshot/no-man-s-sky-pc-mac-steam-wallpaper-1-big.jpg?v=1756388676','img'),(2,1,'https://gaming-cdn.com/images/products/414/screenshot/no-man-s-sky-pc-mac-steam-wallpaper-4-thumbv2.jpg?v=1756388676','img'),(3,1,'https://gaming-cdn.com/images/products/414/screenshot/no-man-s-sky-pc-mac-steam-wallpaper-3-thumbv2.jpg?v=1756388676','img'),(4,1,'https://gaming-cdn.com/images/products/414/screenshot/no-man-s-sky-pc-mac-steam-wallpaper-5-thumbv2.jpg?v=1756388676','img'),(5,1,'https://gaming-cdn.com/images/products/414/screenshot/no-man-s-sky-pc-mac-steam-wallpaper-2-thumbv2.jpg?v=1756388676','img'),(6,1,'https://www.youtube.com/embed/aCgWabJssVI','video'),(7,2,'https://gaming-cdn.com/images/products/442/screenshot/minecraft-java-bedrock-edition-java-bedrock-edition-pc-gioco-wallpaper-1-big.jpg?v=1716387513','img'),(8,2,'https://gaming-cdn.com/images/products/442/screenshot/minecraft-java-bedrock-edition-java-bedrock-edition-pc-gioco-wallpaper-2-thumbv2.jpg?v=1716387513','img'),(9,2,'https://gaming-cdn.com/images/products/442/screenshot/minecraft-java-bedrock-edition-java-bedrock-edition-pc-gioco-wallpaper-3.jpg?v=1716387513','img'),(10,2,'https://gaming-cdn.com/images/products/442/screenshot/minecraft-java-bedrock-edition-java-bedrock-edition-pc-gioco-wallpaper-4.jpg?v=1716387513','img'),(11,2,'https://gaming-cdn.com/images/products/442/screenshot/minecraft-java-bedrock-edition-java-bedrock-edition-pc-gioco-wallpaper-5.jpg?v=1716387513','img'),(12,2,'https://www.youtube.com/embed/MmB9b5njVbA','video'),(13,3,'https://gaming-cdn.com/images/products/4211/screenshot/grand-theft-auto-v-enhanced-pc-rockstar-wallpaper-1-big.jpg?v=1750336095','img'),(14,3,'https://gaming-cdn.com/images/products/4211/screenshot/grand-theft-auto-v-enhanced-pc-rockstar-wallpaper-2.jpg?v=1750336095','img'),(15,3,'https://gaming-cdn.com/images/products/4211/screenshot/grand-theft-auto-v-enhanced-pc-rockstar-wallpaper-3.jpg?v=1750336095','img'),(16,3,'https://gaming-cdn.com/images/products/4211/screenshot/grand-theft-auto-v-enhanced-pc-rockstar-wallpaper-4.jpg?v=1750336095','img'),(17,3,'https://gaming-cdn.com/images/products/4211/screenshot/grand-theft-auto-v-enhanced-pc-rockstar-wallpaper-5.jpg?v=1750336095','img'),(18,3,'https://www.youtube.com/embed/QkkoHAzjnUs','video'),(19,4,'https://gaming-cdn.com/images/products/15381/screenshot/borderlands-4-pc-steam-wallpaper-1-big.jpg?v=1755588316','img'),(20,4,'https://gaming-cdn.com/images/products/15381/screenshot/borderlands-4-pc-steam-wallpaper-2.jpg?v=1755588316','img'),(21,4,'https://gaming-cdn.com/images/products/15381/screenshot/borderlands-4-pc-steam-wallpaper-3.jpg?v=1755588316','img'),(22,4,'https://gaming-cdn.com/images/products/15381/screenshot/borderlands-4-pc-steam-wallpaper-4.jpg?v=1755588316','img'),(23,4,'https://gaming-cdn.com/images/products/15381/screenshot/borderlands-4-pc-steam-wallpaper-5.jpg?v=1755588316','img'),(24,4,'https://www.youtube.com/embed/onY6y4NZ-t4','video'),(25,5,'https://gaming-cdn.com/images/products/19631/screenshot/tiny-bookshop-pc-mac-steam-wallpaper-1-big.jpg?v=1756883267','img'),(26,5,'https://gaming-cdn.com/images/products/19631/screenshot/tiny-bookshop-pc-mac-steam-wallpaper-2.jpg?v=1756883267','img'),(27,5,'https://gaming-cdn.com/images/products/19631/screenshot/tiny-bookshop-pc-mac-steam-wallpaper-3.jpg?v=1756883267','img'),(28,5,'https://gaming-cdn.com/images/products/19631/screenshot/tiny-bookshop-pc-mac-steam-wallpaper-4.jpg?v=1756883267','img'),(29,5,'https://gaming-cdn.com/images/products/19631/screenshot/tiny-bookshop-pc-mac-steam-wallpaper-5.jpg?v=1756883267','img'),(30,5,'https://www.youtube.com/embed/L9NsYX6sLeg','video'),(31,6,'https://gaming-cdn.com/images/products/17015/screenshot/clair-obscur-expedition-33-pc-steam-wallpaper-1-big.jpg?v=1750336145','img'),(32,6,'https://gaming-cdn.com/images/products/17015/screenshot/clair-obscur-expedition-33-pc-steam-wallpaper-2.jpg?v=1750336145','img'),(33,6,'https://gaming-cdn.com/images/products/17015/screenshot/clair-obscur-expedition-33-pc-steam-wallpaper-3.jpg?v=1750336145','img'),(34,6,'https://gaming-cdn.com/images/products/17015/screenshot/clair-obscur-expedition-33-pc-steam-wallpaper-4.jpg?v=1750336145','img'),(35,6,'https://gaming-cdn.com/images/products/17015/screenshot/clair-obscur-expedition-33-pc-steam-wallpaper-5.jpg?v=1750336145','img'),(36,6,'https://www.youtube.com/embed/-qgOZDRDynw','video'),(37,7,'https://gaming-cdn.com/images/products/9575/screenshot/helldivers-2-pc-gioco-steam-europe-us-canada-wallpaper-1-big.jpg?v=1732563825','img'),(38,7,'https://gaming-cdn.com/images/products/9575/screenshot/helldivers-2-pc-gioco-steam-europe-us-canada-wallpaper-2.jpg?v=1732563825','img'),(39,7,'https://gaming-cdn.com/images/products/9575/screenshot/helldivers-2-pc-gioco-steam-europe-us-canada-wallpaper-3.jpg?v=1732563825','img'),(40,7,'https://gaming-cdn.com/images/products/9575/screenshot/helldivers-2-pc-gioco-steam-europe-us-canada-wallpaper-4.jpg?v=1732563825','img'),(41,7,'https://gaming-cdn.com/images/products/9575/screenshot/helldivers-2-pc-gioco-steam-europe-us-canada-wallpaper-5.jpg?v=1732563825','img'),(42,7,'https://www.youtube.com/embed/Aiz0qwdoCXU','video'),(43,8,'https://gaming-cdn.com/images/products/3098/screenshot/assetto-corsa-ultimate-edition-ultimate-edition-pc-gioco-steam-wallpaper-1-big.jpg?v=1715265138','img'),(44,8,'https://gaming-cdn.com/images/products/3098/screenshot/assetto-corsa-ultimate-edition-ultimate-edition-pc-gioco-steam-wallpaper-2.jpg?v=1715265138','img'),(45,8,'https://gaming-cdn.com/images/products/3098/screenshot/assetto-corsa-ultimate-edition-ultimate-edition-pc-gioco-steam-wallpaper-3.jpg?v=1715265138','img'),(46,8,'https://gaming-cdn.com/images/products/3098/screenshot/assetto-corsa-ultimate-edition-ultimate-edition-pc-gioco-steam-wallpaper-4.jpg?v=1715265138','img'),(47,8,'https://gaming-cdn.com/images/products/3098/screenshot/assetto-corsa-ultimate-edition-ultimate-edition-pc-gioco-steam-wallpaper-5.jpg?v=1715265138','img'),(48,8,'https://www.youtube.com/embed/-6X29LcfWsQ','video'),(49,9,'https://gaming-cdn.com/images/products/20161/screenshot/kingdom-come-deliverance-ii-legacy-of-the-forge-pc-steam-wallpaper-1-thumbv2.jpg?v=1756903561','img'),(50,9,'https://gaming-cdn.com/images/products/20161/screenshot/kingdom-come-deliverance-ii-legacy-of-the-forge-pc-steam-wallpaper-2.jpg?v=1756903561','img'),(51,9,'https://gaming-cdn.com/images/products/20161/screenshot/kingdom-come-deliverance-ii-legacy-of-the-forge-pc-steam-wallpaper-3.jpg?v=1756903561','img'),(52,9,'https://gaming-cdn.com/images/products/20161/screenshot/kingdom-come-deliverance-ii-legacy-of-the-forge-pc-steam-wallpaper-4.jpg?v=1756903561','img'),(53,9,'https://www.youtube.com/embed/ju8R8gwD-Vg','video'),(54,10,'https://gaming-cdn.com/images/products/8855/screenshot/lies-of-p-pc-gioco-steam-wallpaper-1-big.jpg?v=1734358617','img'),(55,10,'https://gaming-cdn.com/images/products/8855/screenshot/lies-of-p-pc-gioco-steam-wallpaper-2.jpg?v=1734358617','img'),(56,10,'https://gaming-cdn.com/images/products/8855/screenshot/lies-of-p-pc-gioco-steam-wallpaper-3.jpg?v=1734358617','img'),(57,10,'https://gaming-cdn.com/images/products/8855/screenshot/lies-of-p-pc-gioco-steam-wallpaper-4.jpg?v=1734358617','img'),(58,10,'https://gaming-cdn.com/images/products/8855/screenshot/lies-of-p-pc-gioco-steam-wallpaper-5.jpg?v=1734358617','img'),(59,10,'https://www.youtube.com/embed/kXZoKdr-xeo?si=2jebFzDiPiAJo0BQ','video'),(60,11,'https://gaming-cdn.com/images/products/184/screenshot/batman-arkham-origins-pc-gioco-steam-wallpaper-1-big.jpg?v=1683619090','img'),(61,11,'https://gaming-cdn.com/images/products/184/screenshot/batman-arkham-origins-pc-gioco-steam-wallpaper-2.jpg?v=1683619090','img'),(62,11,'https://gaming-cdn.com/images/products/184/screenshot/batman-arkham-origins-pc-gioco-steam-wallpaper-3.jpg?v=1683619090','img'),(63,11,'https://gaming-cdn.com/images/products/184/screenshot/batman-arkham-origins-pc-gioco-steam-wallpaper-4.jpg?v=1683619090','img'),(64,11,'https://gaming-cdn.com/images/products/184/screenshot/batman-arkham-origins-pc-gioco-steam-wallpaper-5.jpg?v=1683619090','img'),(65,11,'https://www.youtube.com/embed/9pnK8akbd2M','video'),(66,12,'https://gaming-cdn.com/images/products/16993/screenshot/farming-simulator-25-pc-mac-gioco-steam-europe-us-canada-wallpaper-1-big.jpg?v=1746786479','img'),(67,12,'https://gaming-cdn.com/images/products/16993/screenshot/farming-simulator-25-pc-mac-gioco-steam-europe-us-canada-wallpaper-2.jpg?v=1746786479','img'),(68,12,'https://gaming-cdn.com/images/products/16993/screenshot/farming-simulator-25-pc-mac-gioco-steam-europe-us-canada-wallpaper-3.jpg?v=1746786479','img'),(69,12,'https://gaming-cdn.com/images/products/16993/screenshot/farming-simulator-25-pc-mac-gioco-steam-europe-us-canada-wallpaper-4.jpg?v=1746786479','img'),(70,12,'https://gaming-cdn.com/images/products/16993/screenshot/farming-simulator-25-pc-mac-gioco-steam-europe-us-canada-wallpaper-5.jpg?v=1746786479','img'),(71,12,'https://www.youtube.com/embed/IahVluSZrGw','video'),(72,13,'https://gaming-cdn.com/images/products/18920/screenshot/lost-soul-aside-deluxe-edition-pc-steam-wallpaper-1-big.jpg?v=1756474122','img'),(73,13,'https://gaming-cdn.com/images/products/18920/screenshot/lost-soul-aside-deluxe-edition-pc-steam-wallpaper-2.jpg?v=1756474122','img'),(74,13,'https://gaming-cdn.com/images/products/18920/screenshot/lost-soul-aside-deluxe-edition-pc-steam-wallpaper-3.jpg?v=1756474122','img'),(75,13,'https://gaming-cdn.com/images/products/18920/screenshot/lost-soul-aside-deluxe-edition-pc-steam-wallpaper-4.jpg?v=1756474122','img'),(76,13,'https://gaming-cdn.com/images/products/18920/screenshot/lost-soul-aside-deluxe-edition-pc-steam-wallpaper-5.jpg?v=1756474122','img'),(77,13,'https://www.youtube.com/embed/GRhg0RYYsa0','video'),(78,14,'https://gaming-cdn.com/images/products/9093/screenshot/ghost-of-tsushima-director-s-cut-pc-gioco-steam-wallpaper-1-big.jpg?v=1715876608','img'),(79,14,'https://gaming-cdn.com/images/products/9093/screenshot/ghost-of-tsushima-director-s-cut-pc-gioco-steam-wallpaper-2.jpg?v=1715876608','img'),(80,14,'https://gaming-cdn.com/images/products/9093/screenshot/ghost-of-tsushima-director-s-cut-pc-gioco-steam-wallpaper-3.jpg?v=1715876608','img'),(81,14,'https://gaming-cdn.com/images/products/9093/screenshot/ghost-of-tsushima-director-s-cut-pc-gioco-steam-wallpaper-4.jpg?v=1715876608','img'),(82,14,'https://gaming-cdn.com/images/products/9093/screenshot/ghost-of-tsushima-director-s-cut-pc-gioco-steam-wallpaper-5.jpg?v=1715876608','img'),(83,14,'https://www.youtube.com/embed/iqysmS4lxwQ','video'),(84,15,'https://gaming-cdn.com/images/products/5653/screenshot/red-dead-redemption-2-ultimate-edition-ultimate-edition-pc-gioco-rockstar-wallpaper-1-big.jpg?v=1745571744','img'),(85,15,'https://gaming-cdn.com/images/products/5653/screenshot/red-dead-redemption-2-ultimate-edition-ultimate-edition-pc-gioco-rockstar-wallpaper-2.jpg?v=1745571744','img'),(86,15,'https://gaming-cdn.com/images/products/5653/screenshot/red-dead-redemption-2-ultimate-edition-ultimate-edition-pc-gioco-rockstar-wallpaper-3.jpg?v=1745571744','img'),(87,15,'https://gaming-cdn.com/images/products/5653/screenshot/red-dead-redemption-2-ultimate-edition-ultimate-edition-pc-gioco-rockstar-wallpaper-4.jpg?v=1745571744','img'),(88,15,'https://gaming-cdn.com/images/products/5653/screenshot/red-dead-redemption-2-ultimate-edition-ultimate-edition-pc-gioco-rockstar-wallpaper-5.jpg?v=1745571744','img'),(89,15,'https://www.youtube.com/embed/gmA6MrX81z4','video'),(169,16,'https://gaming-cdn.com/images/products/18294/screenshot/elden-ring-nightreign-pc-steam-wallpaper-1-big.jpg?v=1750336104','img'),(170,16,'https://gaming-cdn.com/images/products/18294/screenshot/elden-ring-nightreign-pc-steam-wallpaper-2.jpg?v=1750336104','img'),(171,16,'https://gaming-cdn.com/images/products/18294/screenshot/elden-ring-nightreign-pc-steam-wallpaper-3.jpg?v=1750336104','img'),(172,16,'https://gaming-cdn.com/images/products/18294/screenshot/elden-ring-nightreign-pc-steam-wallpaper-4.jpg?v=1750336104','img'),(173,16,'https://gaming-cdn.com/images/products/18294/screenshot/elden-ring-nightreign-pc-steam-wallpaper-5.jpg?v=1750336104','img'),(174,16,'https://www.youtube.com/embed/E3Huy2cdih0','video'),(175,17,'https://gaming-cdn.com/images/products/840/screenshot/cyberpunk-2077-pc-gioco-gog-com-wallpaper-1.jpg?v=1748447631','img'),(176,17,'https://gaming-cdn.com/images/products/840/screenshot/cyberpunk-2077-pc-gioco-gog-com-wallpaper-2.jpg?v=1748447631','img'),(177,17,'https://gaming-cdn.com/images/products/840/screenshot/cyberpunk-2077-pc-gioco-gog-com-wallpaper-3.jpg?v=1748447631','img'),(178,17,'https://gaming-cdn.com/images/products/840/screenshot/cyberpunk-2077-pc-gioco-gog-com-wallpaper-4.jpg?v=1748447631','img'),(179,17,'https://gaming-cdn.com/images/products/840/screenshot/cyberpunk-2077-pc-gioco-gog-com-wallpaper-5.jpg?v=1748447631','img'),(180,17,'https://www.youtube.com/embed/JFf8I_8Ubv4','video'),(181,18,'https://gaming-cdn.com/images/products/268/screenshot/the-witcher-3-wild-hunt-pc-gioco-gog-com-wallpaper-1.jpg?v=1710174099','img'),(182,18,'https://gaming-cdn.com/images/products/268/screenshot/the-witcher-3-wild-hunt-pc-gioco-gog-com-wallpaper-2.jpg?v=1710174099','img'),(183,18,'https://gaming-cdn.com/images/products/268/screenshot/the-witcher-3-wild-hunt-pc-gioco-gog-com-wallpaper-3.jpg?v=1710174099','img'),(184,18,'https://gaming-cdn.com/images/products/268/screenshot/the-witcher-3-wild-hunt-pc-gioco-gog-com-wallpaper-4.jpg?v=1710174099','img'),(185,18,'https://gaming-cdn.com/images/products/268/screenshot/the-witcher-3-wild-hunt-pc-gioco-gog-com-wallpaper-5.jpg?v=1710174099','img'),(186,18,'https://www.youtube.com/embed/watch?v=XHrskkHf958','video'),(187,19,'https://gaming-cdn.com/images/products/4804/screenshot/baldur-s-gate-3-pc-gioco-gog-com-wallpaper-1.jpg?v=1710239606','img'),(188,19,'https://gaming-cdn.com/images/products/4804/screenshot/baldur-s-gate-3-pc-gioco-gog-com-wallpaper-2.jpg?v=1710239606','img'),(189,19,'https://gaming-cdn.com/images/products/4804/screenshot/baldur-s-gate-3-pc-gioco-gog-com-wallpaper-3.jpg?v=1710239606','img'),(190,19,'https://gaming-cdn.com/images/products/4804/screenshot/baldur-s-gate-3-pc-gioco-gog-com-wallpaper-4.jpg?v=1710239606','img'),(191,19,'https://gaming-cdn.com/images/products/4804/screenshot/baldur-s-gate-3-pc-gioco-gog-com-wallpaper-5.jpg?v=1710239606','img'),(192,19,'https://www.youtube.com/embed/1T22wNvoNiU','video'),(193,20,'https://gaming-cdn.com/images/products/7072/screenshot/hogwarts-legacy-pc-gioco-steam-europe-us-canada-wallpaper-1.jpg?v=1732564014','img'),(194,20,'https://gaming-cdn.com/images/products/7072/screenshot/hogwarts-legacy-pc-gioco-steam-europe-us-canada-wallpaper-2.jpg?v=1732564014','img'),(195,20,'https://gaming-cdn.com/images/products/7072/screenshot/hogwarts-legacy-pc-gioco-steam-europe-us-canada-wallpaper-3.jpg?v=1732564014','img'),(196,20,'https://gaming-cdn.com/images/products/7072/screenshot/hogwarts-legacy-pc-gioco-steam-europe-us-canada-wallpaper-4.jpg?v=1732564014','img'),(197,20,'https://gaming-cdn.com/images/products/7072/screenshot/hogwarts-legacy-pc-gioco-steam-europe-us-canada-wallpaper-5.jpg?v=1732564014','img'),(198,20,'https://www.youtube.com/embed/eFDZipIBBds','video'),(199,21,'https://gaming-cdn.com/images/products/6147/screenshot/assassin-s-creed-valhalla-pc-gioco-ubisoft-connect-europe-wallpaper-1.jpg?v=1709130520','img'),(200,21,'https://gaming-cdn.com/images/products/6147/screenshot/assassin-s-creed-valhalla-pc-gioco-ubisoft-connect-europe-wallpaper-2.jpg?v=1709130520','img'),(201,21,'https://gaming-cdn.com/images/products/6147/screenshot/assassin-s-creed-valhalla-pc-gioco-ubisoft-connect-europe-wallpaper-3.jpg?v=1709130520','img'),(202,21,'https://gaming-cdn.com/images/products/6147/screenshot/assassin-s-creed-valhalla-pc-gioco-ubisoft-connect-europe-wallpaper-4.jpg?v=1709130520','img'),(203,21,'https://gaming-cdn.com/images/products/6147/screenshot/assassin-s-creed-valhalla-pc-gioco-ubisoft-connect-europe-wallpaper-5.jpg?v=1709130520','img'),(204,21,'https://www.youtube.com/embed/QM6Gd8AlJBI','video'),(205,22,'https://gaming-cdn.com/images/products/7080/screenshot/far-cry-6-pc-gioco-ubisoft-connect-europe-wallpaper-1.jpg?v=1737452091','img'),(206,22,'https://gaming-cdn.com/images/products/7080/screenshot/far-cry-6-pc-gioco-ubisoft-connect-europe-wallpaper-2.jpg?v=1737452091','img'),(207,22,'https://gaming-cdn.com/images/products/7080/screenshot/far-cry-6-pc-gioco-ubisoft-connect-europe-wallpaper-3.jpg?v=1737452091','img'),(208,22,'https://gaming-cdn.com/images/products/7080/screenshot/far-cry-6-pc-gioco-ubisoft-connect-europe-wallpaper-4.jpg?v=1737452091','img'),(209,22,'https://gaming-cdn.com/images/products/7080/screenshot/far-cry-6-pc-gioco-ubisoft-connect-europe-wallpaper-5.jpg?v=1737452091','img'),(210,22,'https://www.youtube.com/embed/izejGxXryQM','video'),(211,23,'https://gaming-cdn.com/images/products/6329/screenshot/resident-evil-village-pc-gioco-steam-europe-wallpaper-1.jpg?v=1737102575','img'),(212,23,'https://gaming-cdn.com/images/products/6329/screenshot/resident-evil-village-pc-gioco-steam-europe-wallpaper-2.jpg?v=1737102575','img'),(213,23,'https://gaming-cdn.com/images/products/6329/screenshot/resident-evil-village-pc-gioco-steam-europe-wallpaper-3.jpg?v=1737102575','img'),(214,23,'https://gaming-cdn.com/images/products/6329/screenshot/resident-evil-village-pc-gioco-steam-europe-wallpaper-4.jpg?v=1737102575','img'),(215,23,'https://gaming-cdn.com/images/products/6329/screenshot/resident-evil-village-pc-gioco-steam-europe-wallpaper-5.jpg?v=1737102575','img'),(216,23,'https://www.youtube.com/embed/CNpIfP4vtrE','video'),(217,24,'https://gaming-cdn.com/images/products/2155/screenshot/monster-hunter-world-pc-gioco-steam-europe-wallpaper-1.jpg?v=1710330176','img'),(218,24,'https://gaming-cdn.com/images/products/2155/screenshot/monster-hunter-world-pc-gioco-steam-europe-wallpaper-2.jpg?v=1710330176','img'),(219,24,'https://gaming-cdn.com/images/products/2155/screenshot/monster-hunter-world-pc-gioco-steam-europe-wallpaper-3.jpg?v=1710330176','img'),(220,24,'https://gaming-cdn.com/images/products/2155/screenshot/monster-hunter-world-pc-gioco-steam-europe-wallpaper-4.jpg?v=1710330176','img'),(221,24,'https://gaming-cdn.com/images/products/2155/screenshot/monster-hunter-world-pc-gioco-steam-europe-wallpaper-5.jpg?v=1710330176','img'),(222,24,'https://www.youtube.com/embed/Esgr7NVpmtQ','video'),(223,25,'https://gaming-cdn.com/images/products/3325/screenshot/sekiro-shadows-die-twice-goty-edition-goty-edition-pc-gioco-steam-europe-wallpaper-1.jpg?v=1720608854','img'),(224,25,'https://gaming-cdn.com/images/products/3325/screenshot/sekiro-shadows-die-twice-goty-edition-goty-edition-pc-gioco-steam-europe-wallpaper-2.jpg?v=1720608854','img'),(225,25,'https://gaming-cdn.com/images/products/3325/screenshot/sekiro-shadows-die-twice-goty-edition-goty-edition-pc-gioco-steam-europe-wallpaper-3.jpg?v=1720608854','img'),(226,25,'https://gaming-cdn.com/images/products/3325/screenshot/sekiro-shadows-die-twice-goty-edition-goty-edition-pc-gioco-steam-europe-wallpaper-4.jpg?v=1720608854','img'),(227,25,'https://gaming-cdn.com/images/products/3325/screenshot/sekiro-shadows-die-twice-goty-edition-goty-edition-pc-gioco-steam-europe-wallpaper-5.jpg?v=1720608854','img'),(228,25,'https://www.youtube.com/embed/os5FYSyL01g','video'),(229,26,'https://gaming-cdn.com/images/products/5721/screenshot/death-stranding-pc-steam-wallpaper-1.jpg?v=1752066787','img'),(230,26,'https://gaming-cdn.com/images/products/5721/screenshot/death-stranding-pc-steam-wallpaper-2.jpg?v=1752066787','img'),(231,26,'https://gaming-cdn.com/images/products/5721/screenshot/death-stranding-pc-steam-wallpaper-3.jpg?v=1752066787','img'),(232,26,'https://gaming-cdn.com/images/products/5721/screenshot/death-stranding-pc-steam-wallpaper-4.jpg?v=1752066787','img'),(233,26,'https://gaming-cdn.com/images/products/5721/screenshot/death-stranding-pc-steam-wallpaper-5.jpg?v=1752066787','img'),(234,26,'https://www.youtube.com/embed/WfbvZzTeC1M','video'),(235,27,'https://gaming-cdn.com/images/products/488/screenshot/metal-gear-solid-v-the-phantom-pain-pc-gioco-steam-wallpaper-1.jpg?v=1705331875','img'),(236,27,'https://gaming-cdn.com/images/products/488/screenshot/metal-gear-solid-v-the-phantom-pain-pc-gioco-steam-wallpaper-2.jpg?v=1705331875','img'),(237,27,'https://gaming-cdn.com/images/products/488/screenshot/metal-gear-solid-v-the-phantom-pain-pc-gioco-steam-wallpaper-3.jpg?v=1705331875','img'),(238,27,'https://gaming-cdn.com/images/products/488/screenshot/metal-gear-solid-v-the-phantom-pain-pc-gioco-steam-wallpaper-4.jpg?v=1705331875','img'),(239,27,'https://gaming-cdn.com/images/products/488/screenshot/metal-gear-solid-v-the-phantom-pain-pc-gioco-steam-wallpaper-5.jpg?v=1705331875','img'),(240,27,'https://www.youtube.com/embed/C19ap2M7DDE','video'),(241,28,'https://gaming-cdn.com/images/products/857/screenshot/dark-souls-3-pc-gioco-steam-wallpaper-1.jpg?v=1703156780','img'),(242,28,'https://gaming-cdn.com/images/products/857/screenshot/dark-souls-3-pc-gioco-steam-wallpaper-2.jpg?v=1703156780','img'),(243,28,'https://gaming-cdn.com/images/products/857/screenshot/dark-souls-3-pc-gioco-steam-wallpaper-3.jpg?v=1703156780','img'),(244,28,'https://gaming-cdn.com/images/products/857/screenshot/dark-souls-3-pc-gioco-steam-wallpaper-4.jpg?v=1703156780','img'),(245,28,'https://gaming-cdn.com/images/products/857/screenshot/dark-souls-3-pc-gioco-steam-wallpaper-5.jpg?v=1703156780','img'),(246,28,'https://www.youtube.com/embed/tOyCbjNBjyI','video'),(247,29,'https://gaming-cdn.com/images/products/7325/screenshot/god-of-war-pc-gioco-steam-europe-wallpaper-1.jpg?v=1744715989','img'),(248,29,'https://gaming-cdn.com/images/products/7325/screenshot/god-of-war-pc-gioco-steam-europe-wallpaper-2.jpg?v=1744715989','img'),(249,29,'https://gaming-cdn.com/images/products/7325/screenshot/god-of-war-pc-gioco-steam-europe-wallpaper-3.jpg?v=1744715989','img'),(250,29,'https://gaming-cdn.com/images/products/7325/screenshot/god-of-war-pc-gioco-steam-europe-wallpaper-4.jpg?v=1744715989','img'),(251,29,'https://gaming-cdn.com/images/products/7325/screenshot/god-of-war-pc-gioco-steam-europe-wallpaper-5.jpg?v=1744715989','img'),(252,29,'https://www.youtube.com/embed/wmL7OHyB_Vk','video'),(253,30,'https://gaming-cdn.com/images/products/8701/screenshot/forza-horizon-5-pc-xbox-one-xbox-series-x-s-gioco-microsoft-store-wallpaper-1.jpg?v=1738767995','img'),(254,30,'https://gaming-cdn.com/images/products/8701/screenshot/forza-horizon-5-pc-xbox-one-xbox-series-x-s-gioco-microsoft-store-wallpaper-2.jpg?v=1738767995','img'),(255,30,'https://gaming-cdn.com/images/products/8701/screenshot/forza-horizon-5-pc-xbox-one-xbox-series-x-s-gioco-microsoft-store-wallpaper-3.jpg?v=1738767995','img'),(256,30,'https://gaming-cdn.com/images/products/8701/screenshot/forza-horizon-5-pc-xbox-one-xbox-series-x-s-gioco-microsoft-store-wallpaper-4.jpg?v=1738767995','img'),(257,30,'https://gaming-cdn.com/images/products/8701/screenshot/forza-horizon-5-pc-xbox-one-xbox-series-x-s-gioco-microsoft-store-wallpaper-5.jpg?v=1738767995','img'),(258,30,'https://www.youtube.com/embed/DA02Nc12SPE','video'),(259,31,'https://gaming-cdn.com/images/products/10080/screenshot/halo-infinite-season-1-pc-gioco-steam-wallpaper-1.jpg?v=1700047041','img'),(260,31,'https://gaming-cdn.com/images/products/10080/screenshot/halo-infinite-season-1-pc-gioco-steam-wallpaper-2.jpg?v=1700047041','img'),(261,31,'https://gaming-cdn.com/images/products/10080/screenshot/halo-infinite-season-1-pc-gioco-steam-wallpaper-3.jpg?v=1700047041','img'),(262,31,'https://gaming-cdn.com/images/products/10080/screenshot/halo-infinite-season-1-pc-gioco-steam-wallpaper-4.jpg?v=1700047041','img'),(263,31,'https://gaming-cdn.com/images/products/10080/screenshot/halo-infinite-season-1-pc-gioco-steam-wallpaper-5.jpg?v=1700047041','img'),(264,31,'https://www.youtube.com/embed/g3GP-bgCWBs','video'),(265,32,'https://gaming-cdn.com/images/products/10404/screenshot/call-of-duty-modern-warfare-ii-pc-gioco-steam-wallpaper-1.jpg?v=1699618956','img'),(266,32,'https://gaming-cdn.com/images/products/10404/screenshot/call-of-duty-modern-warfare-ii-pc-gioco-steam-wallpaper-2.jpg?v=1699618956','img'),(267,32,'https://gaming-cdn.com/images/products/10404/screenshot/call-of-duty-modern-warfare-ii-pc-gioco-steam-wallpaper-3.jpg?v=1699618956','img'),(268,32,'https://gaming-cdn.com/images/products/10404/screenshot/call-of-duty-modern-warfare-ii-pc-gioco-steam-wallpaper-4.jpg?v=1699618956','img'),(269,32,'https://gaming-cdn.com/images/products/10404/screenshot/call-of-duty-modern-warfare-ii-pc-gioco-steam-wallpaper-5.jpg?v=1699618956','img'),(270,32,'https://www.youtube.com/embed/zJn6Kn_w3UY','video'),(271,33,'https://gaming-cdn.com/images/products/13351/screenshot/fifa-23-pc-gioco-steam-wallpaper-1.jpg?v=1703155516','img'),(272,33,'https://gaming-cdn.com/images/products/13351/screenshot/fifa-23-pc-gioco-steam-wallpaper-2.jpg?v=1703155516','img'),(273,33,'https://gaming-cdn.com/images/products/13351/screenshot/fifa-23-pc-gioco-steam-wallpaper-3.jpg?v=1703155516','img'),(274,33,'https://gaming-cdn.com/images/products/13351/screenshot/fifa-23-pc-gioco-steam-wallpaper-4.jpg?v=1703155516','img'),(275,33,'https://gaming-cdn.com/images/products/13351/screenshot/fifa-23-pc-gioco-steam-wallpaper-5.jpg?v=1703155516','img'),(276,33,'https://www.youtube.com/embed/t4TXBfBeN8I','video'),(277,34,'https://gaming-cdn.com/images/products/14554/screenshot/nba-2k24-kobe-bryant-edition-kobe-bryant-edition-pc-gioco-steam-wallpaper-1.jpg?v=1712763645','img'),(278,34,'https://gaming-cdn.com/images/products/14554/screenshot/nba-2k24-kobe-bryant-edition-kobe-bryant-edition-pc-gioco-steam-wallpaper-2.jpg?v=1712763645','img'),(279,34,'https://gaming-cdn.com/images/products/14554/screenshot/nba-2k24-kobe-bryant-edition-kobe-bryant-edition-pc-gioco-steam-wallpaper-3.jpg?v=1712763645','img'),(280,34,'https://gaming-cdn.com/images/products/14554/screenshot/nba-2k24-kobe-bryant-edition-kobe-bryant-edition-pc-gioco-steam-wallpaper-4.jpg?v=1712763645','img'),(281,34,'https://gaming-cdn.com/images/products/14554/screenshot/nba-2k24-kobe-bryant-edition-kobe-bryant-edition-pc-gioco-steam-wallpaper-5.jpg?v=1712763645','img'),(282,34,'https://www.youtube.com/embed/GITzbGIiNKg','video'),(283,35,'https://gaming-cdn.com/images/products/272/screenshot/the-sims-4-pc-mac-gioco-ea-app-wallpaper-1.jpg?v=1738145946','img'),(284,35,'https://gaming-cdn.com/images/products/272/screenshot/the-sims-4-pc-mac-gioco-ea-app-wallpaper-2.jpg?v=1738145946','img'),(285,35,'https://gaming-cdn.com/images/products/272/screenshot/the-sims-4-pc-mac-gioco-ea-app-wallpaper-3.jpg?v=1738145946','img'),(286,35,'https://gaming-cdn.com/images/products/272/screenshot/the-sims-4-pc-mac-gioco-ea-app-wallpaper-4.jpg?v=1738145946','img'),(287,35,'https://gaming-cdn.com/images/products/272/screenshot/the-sims-4-pc-mac-gioco-ea-app-wallpaper-5.jpg?v=1738145946','img'),(288,35,'https://www.youtube.com/embed/22I4Aeid13c','video');
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
INSERT INTO `platform_videogame` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),(16,1),(17,1),(18,1),(19,1),(20,1),(21,1),(22,1),(23,1),(24,1),(25,1),(26,1),(27,1),(28,1),(29,1),(30,1),(31,1),(32,1),(33,1),(34,1),(35,1),(1,2),(2,2),(3,2),(4,2),(6,2),(7,2),(8,2),(9,2),(10,2),(11,2),(12,2),(13,2),(14,2),(15,2),(16,2),(17,2),(18,2),(19,2),(20,2),(21,2),(22,2),(23,2),(24,2),(25,2),(26,2),(27,2),(28,2),(32,2),(33,2),(34,2),(35,2),(1,3),(2,3),(3,3),(4,3),(6,3),(8,3),(9,3),(10,3),(11,3),(12,3),(15,3),(16,3),(17,3),(18,3),(19,3),(20,3),(21,3),(22,3),(23,3),(24,3),(25,3),(26,3),(27,3),(28,3),(29,3),(30,3),(31,3),(32,3),(33,3),(34,3),(35,3),(2,4),(12,4);
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
INSERT INTO `videogame_genre` VALUES (10,1),(23,1),(3,2),(4,2),(7,2),(10,2),(11,2),(13,2),(14,2),(15,2),(16,2),(17,2),(18,2),(19,2),(20,2),(21,2),(22,2),(23,2),(24,2),(25,2),(26,2),(27,2),(28,2),(29,2),(30,2),(31,2),(32,2),(33,2),(34,2),(1,3),(2,3),(3,3),(9,3),(11,3),(14,3),(15,3),(22,3),(25,3),(26,3),(27,3),(29,3),(31,3),(32,3),(35,3),(4,4),(6,4),(9,4),(13,4),(16,4),(17,4),(18,4),(19,4),(20,4),(21,4),(24,4),(28,4),(6,5),(33,6),(34,6),(8,7),(30,7),(1,8),(2,8),(5,8),(8,8),(12,8),(35,8);
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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videogames`
--

LOCK TABLES `videogames` WRITE;
/*!40000 ALTER TABLE `videogames` DISABLE KEYS */;
INSERT INTO `videogames` VALUES (1,'No Man\'s Sky','No Man\'s Sky per PC è un gioco di sopravvivenza azione-avventura in cui il giocatore assume la forma di un umanoide alieno schiantato al suolo che riceve il minimo di cui ha bisogno per sopravvivere e svilupparsi. Dotato di un multi-tool, il giocatore può seguire i consigli di un\'entità chiamata Atlas, che di volta in volta si presenta sullo schermo. Questi consigli guidano i giocatori attraverso un percorso prestabilito, offrendo loro molte opportunità per estrarre risorse, fare battaglie o commerciare e fare squadra con compagni di gioco o alieni (questi ultimi sono generati dagli algoritmi dei server in base alla necessità, proprio come le zone più lontane del cosmo). Il modo migliore per giocare è iniziare da solo, costruendo le navi e i corrieri di cui hai bisogno per continuare il tuo viaggio quando ne senti la necessità. Scopri quanto puoi viaggiare lontano, commerciando, estraendo risorse e, contemporaneamente, combattendo.',59.99,NULL,'Hello Games','2016-08-12 00:00:00','https://gaming-cdn.com/images/products/414/616x353/no-man-s-sky-pc-mac-steam-cover.jpg?v=1756388676',120,4.70),(2,'Minecraft: Java & Bedrock Edition','La premessa del gioco è estremamente semplice: si arriva al gioco con nient\'altro che le mani e un inventario limitato. Devi scavare per raccogliere materiali che poi usi per creare strumenti e costruire case e altri edifici. Le risorse vanno dalle più comuni ad altre molto rare, e spesso le materie prime più rare e preziose sono le più difficili da raggiungere, richiedono scavi in profondità e persino la costruzione di tunnel di rinforzo per impedire le inondazioni o la caduta di rocce. Non esiste un arco narrativo, in quanto tale: dipende interamente da te e da ciò che vuoi ottenere. Puoi costruire città o una dimora rurale, allevare pecore o andare a pescare. Il gioco è esattamente quello che tu e la tua immaginazione volete che sia.',29.99,14.99,'Xbox Game Studios','2015-11-19 00:00:00','https://gaming-cdn.com/images/products/442/616x353/minecraft-java-bedrock-edition-java-bedrock-edition-pc-gioco-cover.jpg?v=1716387513',80,4.50),(3,'Grand Theft Auto V Enhanced (Rockstar)','Un giovane truffatore, un rapinatore di banche in pensione e uno spaventoso psicopatico si ritrovano nel mirino degli elementi più discutibili del mondo del crimine, del governo statunitense e dell\'industria dello spettacolo. Per sopravvivere dovranno mettere in atto una serie di audaci colpi in una città spietata dove non possono fidarsi di nessuno, men che meno gli uni degli altri. I giocatori su PC possono trasferire i progressi di gioco della modalità Storia di GTAV e i personaggi e progressi di GTA Online con un trasferimento unico dalla versione classica di GTAV a GTAV Enhanced.',17.99,NULL,'Xbox Game Studios','2011-11-19 00:00:00','https://gaming-cdn.com/images/products/4211/616x353/grand-theft-auto-v-enhanced-pc-rockstar-cover.jpg?v=1750336095',80,4.60),(4,'Borderlands 4','Borderlands 4 è un concentrato di azione, Cacciatori della Cripta e miliardi di armi feroci e letali nello scenario di un nuovo pianeta comandato da uno spietato tiranno. Catapultati su Kairos nei panni di uno dei nuovi Cacciatori della Cripta alla caccia di gloria e ricchezze. Sfrutta potenti abilità d\'azione, personalizza la tua build con accurate specializzazioni e domina i nemici con abilità di movimento dinamiche. Sfuggi all\'opprimente giogo del Cronocustode, uno spietato dittatore che domina il popolo dall\'alto. Ma una catastrofe di proporzioni globali rischia di mettere a repentaglio il suo perfetto Ordine, gettando l\'intero pianeta nel Caos più profondo.',51.99,46.99,'Rockstar North','2025-09-03 00:00:00','https://gaming-cdn.com/images/products/15381/616x353/borderlands-4-pc-steam-cover.jpg?v=1755588316',40,4.60),(5,'Tiny Bookshop','Lasciati tutto alle spalle e apri una piccola libreria vicino al mare in questo gioco gestionale narrativo carinissimo. Riempi la tua piccola libreria con diversi libri e oggetti, aprila vicino paesaggi scenici e avvia la tua libreria di libri usati mentre impari a conoscere le persone del luogo.',19.99,NULL,'neoludic games','2025-08-07 00:00:00','https://gaming-cdn.com/images/products/19631/616x353/tiny-bookshop-pc-mac-steam-cover.jpg?v=1756883267',127,4.30),(6,'Clair Obscur: Expedition 33','Una volta all\'anno, la Pittrice si risveglia e inizia a dipingere sul suo Monolito. Dipinge il numero maledetto. E tutti coloro che hanno più di quell\'età si tramutano in fumo e svaniscono. Anno dopo anno il numero cambia, e altre persone vengono cancellate. Domani la Pittrice si sveglierà e dipingerà il numero \"33\". E domani noi partiremo per la missione finale: distruggere la Pittrice, in modo che non possa più dipingere la morte. Noi siamo la Spedizione 33 Clair Obscur: Expedition 33 è un innovativo GDR a turni con meccaniche di gioco in tempo reale che rendono le battaglie più immersive e coinvolgenti che mai. Esplora un mondo di fantasia ispirato alla Francia della Belle Époque, in cui dovrai affrontare nemici devastanti.',59.99,27.99,'Sandfall interactive','2025-04-24 00:00:00','https://gaming-cdn.com/images/products/17015/616x353/clair-obscur-expedition-33-pc-steam-cover.jpg?v=1750336145',345,4.90),(7,'Helldivers 2','L\'ultima linea di attacco della galassia. Unisciti agli Helldiver per combattere in nome della libertà in una galassia ostile in questo frenetico e feroce sparatutto in terza persona.',39.99,NULL,'Arrowhead Game Studios','2024-02-08 00:00:00','https://gaming-cdn.com/images/products/9575/616x353/helldivers-2-pc-gioco-steam-europe-us-canada-cover.jpg?v=1732563825',345,4.50),(8,'Assetto Corsa Ultimate Edition','Scegli tra 178 dettagliatissimi veicoli (il loro assetto di guida e le loro prestazioni sono realizzate in base a dati e telemetria reali) e 19 circuiti leggendari (tra cui quello di Spa-Francorchamps, Nürburgring-Nordschleife, Laguna Seca e molti altri) con 40 diverse configurazioni di tracciato, tutte ricreate attraverso scansione laser. Lanciati in pista come giocatore singolo o competi con amici online in modalità multigiocatore. Personalizza la tua esperienza di guida regolando le impostazioni di guida e di gara, per ottenere il tuo personale stile guida. Grazie al suo motore fisico avanzato, basato su caratteristiche reali delle auto, questa Ultimate Edition offre un livello di realismo mai provato prima.',19.99,4.99,'Kunos Simulazioni','2014-12-19 00:00:00','https://gaming-cdn.com/images/products/3098/616x353/assetto-corsa-ultimate-edition-ultimate-edition-pc-gioco-steam-cover.jpg?v=1715265138',48,4.50),(9,'Kingdom Come: Deliverance II Gold Edition','Un emozionante GdR d\'azione a mondo aperto incentrato su un\'avvincente trama, ambientato nell\'Europa medievale del XV secolo. Vivi l\'avventura medievale definitiva attraverso gli occhi del giovane Henry, affrontando un\'impresa di proporzioni epiche.',49.99,NULL,'Warhorse Studios','2025-02-04 00:00:00','https://gaming-cdn.com/images/products/17459/616x353/kingdom-come-deliverance-ii-gold-edition-pc-steam-cover.jpg?v=1750336386',234,4.60),(10,'Lies Of P','Siete un burattino creato da Geppetto che rimane intrappolato in una rete di bugie, con mostri inimmaginabili e personaggi inaffidabili che si frappongono tra te e gli eventi che si sono abbattuti sul mondo di Lies of P. Sei stato risvegliato da una voce misteriosa che ti guida attraverso la tormentata città di Krat, un luogo un tempo vivace che è stato avvelenato dalla follia e dalla sete di sangue. Nel nostro soulslike, dovrai adattare te e le tue armi per affrontare orrori indicibili, districare gli insondabili segreti delle élite della città e scegliere se affrontare i problemi con la verità o con le menzogne, per superarli nel viaggio per ritrovare te stesso.',59.99,19.89,'NEOWIZ','2023-09-18 00:00:00','https://gaming-cdn.com/images/products/8855/616x353/lies-of-p-pc-gioco-steam-cover.jpg?v=1734358617',54,4.70),(11,'Batman: Arkham Origins','La Storia di Arkham inizia con Batman: Arkham Origins, che presenta un racconto cruciale che si svolge alla vigilia di Natale quando Batman è perseguitato da otto dei più letali assassini dell’universo DC. I giocatori possono impersonane un giovane Batman ai suoi primi scontri contro i tanti personaggi che cambieranno il suo futuro.',59.99,NULL,'Warner Bros. Interactive Entertainment','2013-10-25 00:00:00','https://gaming-cdn.com/images/products/184/616x353/batman-arkham-origins-pc-gioco-steam-cover.jpg?v=1683619090',234,4.80),(12,'Farming Simulator 25','Farming Simulator 25 vi invita a tuffarvi nella gratificante vita agricola. Scegliete voi se costruire il vostro retaggio da soli o collaborando nel multiplayer: è la vostra fattoria! Una fattoria tutta vostra. Costruite la fattoria tra i fiumi sinuosi e gli storici montacarichi da cereali del Nord America, tra gli specchi d\'acqua dell\'Europa centrale o in un rigoglioso panorama dell\'Asia orientale ricco di risaie accanto a una città portuale dalle mille luci. Coltivate i campi, allevate gli animali, datevi alla silvicoltura e gestite un vero e proprio impero con negozi, produzioni e costruzioni!',59.99,19.89,'Giants Software','2024-11-12 00:00:00','https://gaming-cdn.com/images/products/16993/616x353/farming-simulator-25-pc-mac-gioco-steam-europe-us-canada-cover.jpg?v=1746786479',373,4.50),(13,'Lost Soul Aside Deluxe Edition','Lotta per salvare il tuo mondo. Salva tua sorella. Salva la tua anima.',59.99,NULL,'Ultizero Games','2025-08-29 00:00:00','https://gaming-cdn.com/images/products/18920/616x353/lost-soul-aside-deluxe-edition-pc-steam-cover.jpg?v=1756474122',27,3.90),(14,'Ghost of Tsushima: Director\'s Cut','Ghost of Tsushima per PC è un pluripremiato gioco d\'azione e avventura open world, con una prospettiva per il giocatore in terza persona. È ambientato nell\'antico Giappone feudale, ma i problemi affrontati dal protagonista saranno facilmente compresi dai giocatori occidentali e moderni.',59.99,37.99,'Sucker Punch Productions & Nixxes Software','2024-08-29 00:00:00','https://gaming-cdn.com/images/products/9093/616x353/ghost-of-tsushima-director-s-cut-pc-gioco-steam-cover.jpg?v=1715876608',127,4.10),(15,'Red Dead Redemption 2','Red Dead Redemption 2 per PC è un gioco d’azione ambientato in un open world in cui il giocatore può vagare liberamente con alcuni elementi che si svolgono in terza persona, altri in modalità di gioco in prima persona. Il giocatore può commettere crimini, ma dovrà però essere pronto a fronteggiare le forze dell\'ordine che vorranno far valere l\'intero peso della legge sul miscredente!',59.99,NULL,'Rockstar Games','2019-12-05 00:00:00','https://gaming-cdn.com/images/products/5679/616x353/red-dead-redemption-2-pc-gioco-rockstar-cover.jpg?v=1713793245',71,4.80),(16,'Elden Ring','Un GDR open world epico dei creatori di Dark Souls, con un vasto mondo da esplorare e boss leggendari.',59.99,39.99,'FromSoftware','2022-02-25 00:00:00','https://gaming-cdn.com/images/products/18294/616x353/elden-ring-nightreign-pc-steam-cover.jpg?v=1750336104',220,4.90),(17,'Cyberpunk 2077','Un gioco di ruolo futuristico ambientato a Night City, pieno di azione, storie complesse e personalizzazione.',59.99,NULL,'CD Projekt Red','2020-12-10 00:00:00','https://gaming-cdn.com/images/products/840/616x353/cyberpunk-2077-pc-gioco-gog-com-cover.jpg?v=1748447631',300,4.10),(18,'The Witcher 3: Wild Hunt','Un GDR fantasy open world con una trama coinvolgente, mostri e scelte morali.',49.99,14.99,'CD Projekt Red','2015-05-19 00:00:00','https://gaming-cdn.com/images/products/268/616x353/the-witcher-3-wild-hunt-pc-gioco-gog-com-cover.jpg?v=1710174099',180,4.90),(19,'Baldur\'s Gate 3','Un GDR a turni basato su Dungeons & Dragons con una storia ramificata e co-op.',59.99,NULL,'Larian Studios','2023-08-03 00:00:00','https://gaming-cdn.com/images/products/4804/616x353/baldur-s-gate-3-pc-gioco-gog-com-cover.jpg?v=1710239606',150,4.90),(20,'Hogwarts Legacy','Un GDR ambientato nel mondo di Harry Potter, con esplorazione, magie e avventure a Hogwarts.',59.99,29.99,'Avalanche Software','2023-02-10 00:00:00','https://gaming-cdn.com/images/products/7072/616x353/hogwarts-legacy-pc-gioco-steam-europe-us-canada-cover.jpg?v=1732564014',200,4.60),(21,'Assassin\'s Creed Valhalla','Vivi la saga vichinga in un open world ricco di battaglie, esplorazioni e intrighi.',59.99,NULL,'Ubisoft Montreal','2020-11-10 00:00:00','https://gaming-cdn.com/images/products/6147/616x353/assassin-s-creed-valhalla-pc-gioco-ubisoft-connect-europe-cover.jpg?v=1709130520',250,4.40),(22,'Far Cry 6','Uno sparatutto open world ambientato su un\'isola caraibica sotto dittatura, con azione e libertà totale.',59.99,24.99,'Ubisoft Toronto','2021-10-07 00:00:00','https://gaming-cdn.com/images/products/7080/616x353/far-cry-6-pc-gioco-ubisoft-connect-europe-cover.jpg?v=1737452091',190,4.30),(23,'Resident Evil Village','Ottavo capitolo della saga horror, con atmosfere gotiche e nemici terrificanti.',59.99,NULL,'Capcom','2021-05-07 00:00:00','https://gaming-cdn.com/images/products/6329/616x353/resident-evil-village-pc-gioco-steam-europe-cover.jpg?v=1737102575',210,4.50),(24,'Monster Hunter: World','Caccia enormi creature in ecosistemi vivi e dinamici, da solo o in cooperativa.',39.99,14.99,'Capcom','2018-01-26 00:00:00','https://gaming-cdn.com/images/products/2155/616x353/monster-hunter-world-pc-gioco-steam-europe-cover.jpg?v=1710330176',170,4.70),(25,'Sekiro: Shadows Die Twice','Un action-adventure ambientato nel Giappone Sengoku con combattimenti intensi e boss impegnativi.',59.99,NULL,'FromSoftware','2019-03-22 00:00:00','https://gaming-cdn.com/images/products/3325/616x353/sekiro-shadows-die-twice-goty-edition-goty-edition-pc-gioco-steam-europe-cover.jpg?v=1720608854',140,4.80),(26,'Death Stranding','Un gioco open world unico diretto da Hideo Kojima, che mescola avventura, esplorazione e narrativa.',59.99,19.99,'Kojima Productions','2019-11-08 00:00:00','https://gaming-cdn.com/images/products/5721/616x353/death-stranding-pc-steam-cover.jpg?v=1752066787',230,4.50),(27,'Metal Gear Solid V: The Phantom Pain','Uno stealth-action epico con meccaniche di infiltrazione avanzate.',29.99,NULL,'Kojima Productions','2015-09-01 00:00:00','https://gaming-cdn.com/images/products/488/616x353/metal-gear-solid-v-the-phantom-pain-pc-gioco-steam-cover.jpg?v=1705331875',160,4.60),(28,'Dark Souls III','Terzo capitolo della serie Souls, con combattimenti brutali e ambientazioni cupe.',49.99,14.99,'FromSoftware','2016-04-12 00:00:00','https://gaming-cdn.com/images/products/857/616x353/dark-souls-3-pc-gioco-steam-cover.jpg?v=1703156780',190,4.70),(29,'God of War','Kratos e suo figlio Atreus affrontano le divinità norrene in un\'avventura epica.',49.99,NULL,'Santa Monica Studio','2022-01-14 00:00:00','https://gaming-cdn.com/images/products/7325/616x353/god-of-war-pc-gioco-steam-europe-cover.jpg?v=1744715989',200,4.90),(30,'Forza Horizon 5','Un racing open world ambientato in Messico, con centinaia di auto e paesaggi mozzafiato.',59.99,29.99,'Playground Games','2021-11-09 00:00:00','https://gaming-cdn.com/images/products/8701/616x353/forza-horizon-5-pc-xbox-one-xbox-series-x-s-gioco-microsoft-store-cover.jpg?v=1738767995',240,4.80),(31,'Halo Infinite','Nuovo capitolo della saga Halo, con Master Chief pronto a combattere contro i Banished.',59.99,NULL,'343 Industries','2021-12-08 00:00:00','https://gaming-cdn.com/images/products/10080/616x353/halo-infinite-season-1-pc-gioco-steam-cover.jpg?v=1700047041',220,4.20),(32,'Call of Duty: Modern Warfare II','Uno sparatutto realistico con una campagna intensa e multiplayer competitivo.',69.99,34.99,'Infinity Ward','2022-10-28 00:00:00','https://gaming-cdn.com/images/products/10404/616x353/call-of-duty-modern-warfare-ii-pc-gioco-steam-cover.jpg?v=1699618956',270,4.40),(33,'FIFA 23','L\'ultimo capitolo calcistico di EA Sports, con squadre e licenze aggiornate.',69.99,NULL,'EA Sports','2022-09-30 00:00:00','https://gaming-cdn.com/images/products/13351/616x353/fifa-23-pc-gioco-steam-cover.jpg?v=1703155516',310,4.30),(34,'NBA 2K24 - Kobe Bryant Edition','Simulazione di basket realistica con squadre NBA, nuove meccaniche e grafica avanzata.',59.99,29.99,'Visual Concepts','2023-09-08 00:00:00','https://gaming-cdn.com/images/products/14554/616x353/nba-2k24-kobe-bryant-edition-kobe-bryant-edition-pc-gioco-steam-cover.jpg?v=1712763645',150,4.10),(35,'The Sims 4','Un simulatore di vita che ti permette di creare, gestire e vivere storie uniche.',39.99,NULL,'Maxis','2014-09-02 00:00:00','https://gaming-cdn.com/images/products/272/616x353/the-sims-4-pc-mac-gioco-ea-app-cover.jpg?v=1738145946',350,4.50);
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

-- Dump completed on 2025-09-07 10:58:45
