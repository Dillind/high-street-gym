-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (arm64)
--
-- Host: 127.0.0.1    Database: high-street-gym
-- ------------------------------------------------------
-- Server version	8.1.0

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
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `activity_id` int NOT NULL AUTO_INCREMENT,
  `activity_name` varchar(45) NOT NULL,
  `activity_description` varchar(400) NOT NULL,
  `activity_duration` int NOT NULL,
  PRIMARY KEY (`activity_id`),
  UNIQUE KEY `activity_id_UNIQUE` (`activity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,'Boxing','Boxing is a combat sport that involves striking opponents with punches using gloved hands. It incorporates various techniques, including footwork, head movement, and defensive maneuvers, to outmaneuver and outscore opponents.',2),(6,'HIIT','HIIT is a form of interval training that alternates between short bursts of intense exercise and periods of rest or low-intensity recovery. It typically involves cardiovascular exercises such as sprinting, jumping, or cycling performed at maximum effort for a short duration followed by brief recovery periods.',1),(7,'Indoor Cycling','Indoor cycling, also known as spinning, involves riding stationary bicycles in a group fitness setting or individually. It simulates outdoor cycling experiences and is typically performed to music led by an instructor who guides participants through various intensities and techniques.',3),(9,'Pilates','Pilates is a low-impact exercise method that focuses on strengthening muscles while improving postural alignment and flexibility. This class incorporates a series of controlled movements performed on a mat or using specialized equipment, designed to target core muscles, enhance body awareness, and promote overall well-being.',2),(10,'Abs','Abs class is a targeted workout focusing on strengthening and toning the abdominal muscles. Through a series of dynamic exercises, participants engage in various core-strengthening movements designed to sculpt and define the abs. This class may include a combination of crunches, planks, twists, and leg raises, offering a challenging yet rewarding workout experience.',1),(11,'Zumba','Zumba is a high-energy dance fitness class inspired by Latin rhythms and international music. Participants move and groove to the beat of salsa, merengue, cumbia, and other dance styles, creating a fun and exhilarating workout experience. Zumba combines aerobic and dance movements to improve cardiovascular fitness, burn calories, and boost mood.',1),(12,'Yoga','Yoga is a holistic practice that integrates physical postures, breathwork, and meditation to promote balance, strength, and relaxation. In a yoga class, participants engage in a series of poses that stretch and strengthen the body while fostering mindfulness and inner calm. With a focus on alignment and breath awareness, yoga cultivates flexibility, mobility, and stress reduction.',1);
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `blog_id` int NOT NULL AUTO_INCREMENT,
  `blog_title` varchar(45) NOT NULL,
  `blog_content` varchar(250) NOT NULL,
  `blog_user_id` int NOT NULL,
  `blog_datetime` datetime NOT NULL,
  PRIMARY KEY (`blog_id`),
  UNIQUE KEY `post_id_UNIQUE` (`blog_id`),
  KEY `fk_blog_user_idx` (`blog_user_id`),
  CONSTRAINT `fk_blog_user` FOREIGN KEY (`blog_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (1,'Welcome','Hi there, my name is Dylan and I just wanted to introduce myself!',1,'2024-04-03 13:54:43'),(66,'testing','test',1,'2024-04-29 08:09:10'),(67,'test','test',5,'2024-04-29 08:09:41');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `booking_user_id` int NOT NULL,
  `booking_class_id` int NOT NULL,
  `booking_created_datetime` datetime NOT NULL,
  PRIMARY KEY (`booking_id`),
  UNIQUE KEY `booking_id_UNIQUE` (`booking_id`),
  KEY `fk_booking_user_idx` (`booking_user_id`),
  KEY `fk_booking_class_idx` (`booking_class_id`),
  CONSTRAINT `fk_booking_class` FOREIGN KEY (`booking_class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_booking_user` FOREIGN KEY (`booking_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,3,1,'2024-04-03 15:27:59'),(27,3,7,'2024-04-11 14:50:33'),(58,1,10,'2024-04-17 07:36:51'),(71,1,18,'2024-04-24 15:04:33'),(73,5,18,'2024-04-25 16:17:46'),(76,5,5,'2024-04-25 16:20:31'),(77,5,19,'2024-04-25 16:50:35'),(78,5,10,'2024-04-25 16:50:37'),(80,43,18,'2024-04-25 17:43:19');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `class_id` int NOT NULL AUTO_INCREMENT,
  `class_datetime` datetime NOT NULL,
  `class_activity_id` int NOT NULL,
  `class_location_id` int NOT NULL,
  `class_trainer_id` int NOT NULL,
  PRIMARY KEY (`class_id`),
  UNIQUE KEY `class_id_UNIQUE` (`class_id`),
  KEY `fk_trainer_user_idx` (`class_trainer_id`),
  KEY `fk_class_activity_idx` (`class_activity_id`),
  KEY `fk_class_location_idx` (`class_location_id`),
  CONSTRAINT `fk_class_activity` FOREIGN KEY (`class_activity_id`) REFERENCES `activities` (`activity_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_class_location` FOREIGN KEY (`class_location_id`) REFERENCES `locations` (`location_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_class_user` FOREIGN KEY (`class_trainer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (1,'2024-04-03 14:30:51',1,2,4),(3,'2024-04-04 12:10:00',1,1,5),(5,'2024-04-04 16:30:00',1,2,4),(6,'2024-04-01 13:00:00',6,2,4),(7,'2024-04-02 16:00:00',7,2,4),(10,'2024-04-29 10:30:00',7,1,5),(14,'2024-04-29 12:30:51',12,2,4),(17,'2024-04-25 07:30:51',11,1,4),(18,'2024-04-26 14:30:00',12,1,4),(19,'2024-04-30 14:30:00',1,2,4);
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `location_name` varchar(60) NOT NULL,
  PRIMARY KEY (`location_id`),
  UNIQUE KEY `location_id_UNIQUE` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Chermside'),(2,'Southbank'),(3,'South Brisbane');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_first_name` varchar(70) NOT NULL,
  `user_last_name` varchar(70) NOT NULL,
  `user_email` varchar(256) NOT NULL,
  `user_password` varchar(100) NOT NULL,
  `user_phone` varchar(45) NOT NULL,
  `user_role` enum('admin','trainer','member') NOT NULL,
  `user_profile_img` varchar(150) DEFAULT NULL,
  `user_authentication_key` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `idusers_UNIQUE` (`user_id`),
  UNIQUE KEY `user_authentication_key_UNIQUE` (`user_authentication_key`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Dylan','Lindsay','dylan@email.com','$2a$10$hXRw8irq7wB5Y2fhj8HdHOcJBCTASSw8KGZrOvk6TvxqJpd3Z8vEm','0424548904','admin',NULL,NULL),(3,'George','Washington','george@washington.com','$2a$10$raDZnJ4zJic6RAwUTOBOluGMDvjcuj91PlCNdvqhH/0olrjdUxu9y','0434567891','member',NULL,NULL),(4,'Jane','Doe','janedoe@email.com','$2a$10$7HZ4qH4UwjpkL348bd8I6.cfhQlgzRt0vg6k8OpikxiwV/coC5gLO','0424 452 111','trainer',NULL,NULL),(5,'James','Doe','jamesdoe@email.com','$2a$10$4cxj9gmcQH.CuqtCMz3Y9.s6/q1PhOA5Gc0fRn8lfO2Ov7NMl3XP6','0424 452 999','trainer',NULL,NULL),(12,'Hello','Test','test@email.com','$2a$10$/2USsRzhfskPmBPuxnZUbOT31Zw/QdrvRid.O99UmxLco7LrMSlcK','0424 452 999','member',NULL,NULL),(14,'Jenny','Stones','jennystones@gmail.com','$2a$10$Xpa7zjCwOd9ppyM3YHzkxuuSXfV3IoYu68g.9zbOE07pG/ZnmtzJ2','0412 546 789','member',NULL,NULL),(23,'Lisa','Hinton','lisahinton@gmail.com','$2a$10$0WhFaWRYt39aL9UXsAETouRoGOExOEbaMoftlwMfYNydbWXSk6Mri','0468573671','member',NULL,NULL),(27,'Lisa','Hint','lisahint@email.com','$2a$10$vplDvj7vgtROuNxnFTUmMuRJ2cY5eXFgOuZpXgKx2bDQasXqt9vpm','0412345678','member',NULL,NULL),(28,'Test','Test','test@test.com','$2a$10$NBzlG.YkGj6qTfy9dfakbemiT5BWkBr0dZgmurClczw0h5tX9HQ3.','0412345678','member',NULL,NULL),(32,'Test','Doe','testdoe@email.com','$2a$10$b2Rv8CfsqVtytHia9.qG3e.Ki.D8vJSUrlw1q6ivc06ItJNEDGBz2','0424 452 123','member',NULL,NULL),(42,'Dylan','Lind','dylanlind@email.com','$2a$10$1wBbjqORXmsUylZrf5RI4.YKW/VtE8q6o8h4mTGhPSU55i88d4F8W','0423 832 321','member',NULL,NULL),(43,'Jasper','Riedel','jasper.riedel@email.com','$2a$10$BeYUdjVT1bKwDR.XHSPva.2kXeeK7bMGE2isXocntVswBnikvV0uq','0424548904','member',NULL,NULL),(44,'Dylan','Lindsay','dylan.lindsay234@gmail.com','$2a$10$j3V5U4VAp8ibxj0GdRUgq.x6aniqLRnA2/BH5pUHy1Vg5O90FKWs.','0424548904','member',NULL,NULL),(45,'Johnny','Depp','johnny.depp@email.com','$2a$10$.OnkU4pqheYUaNNfPyqQtuWDmEumJYSTeqcgkxGDsVmbWg1B90/0C','0412321312','member',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-01  7:08:24
