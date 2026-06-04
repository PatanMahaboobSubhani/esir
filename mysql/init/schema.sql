/*M!999999\- enable the sandbox mode */ 

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;
DROP TABLE IF EXISTS `discussions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `discussions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) DEFAULT NULL,
  `submission_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `discussions` WRITE;
/*!40000 ALTER TABLE `discussions` DISABLE KEYS */;
/*!40000 ALTER TABLE `discussions` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES
(1,2,1,'New Submission Received','A new manuscript \"this PDF only dummy ...\" has been submitted by email one.','update',0,'2026-06-03 13:48:03'),
(2,3,1,'New Submission Received','A new manuscript \"this PDF only dummy ...\" has been submitted by email one.','update',0,'2026-06-03 13:48:03'),
(3,4,1,'New Submission Received','A new manuscript \"this PDF only dummy ...\" has been submitted by email one.','update',0,'2026-06-03 13:48:03'),
(4,5,1,'New Submission Received','A new manuscript \"this PDF only dummy ...\" has been submitted by email one.','update',0,'2026-06-03 13:48:03'),
(5,9,1,'Review Process Started','Your manuscript \"this PDF only dummy...\" is now Under Review.','info',0,'2026-06-03 13:51:46'),
(6,1,1,'New Review Assignment','You have been invited to review the manuscript \"this PDF only dummy...\".','action_required',0,'2026-06-03 13:51:46'),
(7,0,1,'Review Submitted','A reviewer has completed their evaluation for manuscript #1.','info',0,'2026-06-03 13:52:54'),
(8,9,1,'Editorial Decision Recorded','The Editorial Board has recorded a decision for your manuscript \"this PDF only dummy...\": Accepted.','info',0,'2026-06-03 13:54:39'),
(9,2,1,'Proofs Confirmed','Author has confirmed final proofs for manuscript #1: this PDF only dummy...','success',0,'2026-06-03 13:55:09'),
(10,3,1,'Proofs Confirmed','Author has confirmed final proofs for manuscript #1: this PDF only dummy...','success',0,'2026-06-03 13:55:09'),
(11,4,1,'Proofs Confirmed','Author has confirmed final proofs for manuscript #1: this PDF only dummy...','success',0,'2026-06-03 13:55:09'),
(12,5,1,'Proofs Confirmed','Author has confirmed final proofs for manuscript #1: this PDF only dummy...','success',0,'2026-06-03 13:55:09'),
(16,9,1,'Manuscript Scheduled','Your manuscript \"this PDF only dummy...\" has been scheduled for publication on 2026-06-03T13:57:00.000Z.','success',0,'2026-06-03 13:55:56'),
(17,9,1,'Editorial Decision Recorded','The Editorial Board has recorded a decision for your manuscript \"this PDF only dummy...\": Revisions Required.','info',0,'2026-06-03 13:58:05'),
(18,0,1,'Revisions Submitted','Author has submitted revised files for manuscript #1.','info',0,'2026-06-03 13:58:48'),
(19,9,1,'Editorial Decision Recorded','The Editorial Board has recorded a decision for your manuscript \"this PDF only dummy...\": Published.','info',0,'2026-06-03 13:59:16'),
(20,9,1,'Editorial Decision Recorded','The Editorial Board has recorded a decision for your manuscript \"this PDF only dummy...\": Declined.','info',0,'2026-06-03 14:00:07');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `token` varchar(512) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `used` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
INSERT INTO `password_resets` VALUES
(1,'kappakepapa@gmail.com','bde4dc8c186a1736891ce53b2f7589c5b123af1986d7f87c23c50e52cc02323e','2026-06-03 14:36:03','2026-06-03 13:36:03',1);
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `reviewer_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviewer_assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submission_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `token` varchar(512) DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `response_deadline` datetime DEFAULT NULL,
  `review_deadline` datetime DEFAULT NULL,
  `assigned_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `reviewer_assignments` WRITE;
/*!40000 ALTER TABLE `reviewer_assignments` DISABLE KEYS */;
INSERT INTO `reviewer_assignments` VALUES
(1,1,1,'Completed','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXZpZXdlcklkIjoxLCJzdWJtaXNzaW9uSWQiOjEsImlhdCI6MTc4MDQ5NDcwNiwiZXhwIjoxNzgxMDk5NTA2fQ.d6bYn_ZL4Mzwv4luZldIrjxIgJIH36V-5gn5moPnTRs','2026-06-10 13:51:46','2026-06-10 13:51:46','2026-06-24 13:51:46','2026-06-03 13:51:46');
/*!40000 ALTER TABLE `reviewer_assignments` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `submission_contributors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `submission_contributors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submission_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `submission_contributors` WRITE;
/*!40000 ALTER TABLE `submission_contributors` DISABLE KEYS */;
INSERT INTO `submission_contributors` VALUES
(1,1,'asd','asd@asd','2026-06-03 13:48:02');
/*!40000 ALTER TABLE `submission_contributors` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `submission_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `submission_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submission_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `path` varchar(512) DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `submission_files` WRITE;
/*!40000 ALTER TABLE `submission_files` DISABLE KEYS */;
INSERT INTO `submission_files` VALUES
(1,1,'Advanced_6_Month_Plan_1780494463010_njfe7h.pdf','Article Text','/uploads/Advanced_6_Month_Plan_1780494463010_njfe7h.pdf','2026-06-03 13:48:02'),
(2,1,'IT_Test_40_Questions - Copy.pdf','Revised Manuscript','/uploads/IT_Test_40_Questions___Copy_1780495127261_o8gfpy.pdf','2026-06-03 13:58:48');
/*!40000 ALTER TABLE `submission_files` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `submission_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `submission_reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submission_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `checklist_json` text DEFAULT NULL,
  `comments_authors` text DEFAULT NULL,
  `comments_editors` text DEFAULT NULL,
  `recommendation` varchar(50) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `file_url` varchar(512) DEFAULT NULL,
  `is_draft` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `submission_reviews` WRITE;
/*!40000 ALTER TABLE `submission_reviews` DISABLE KEYS */;
INSERT INTO `submission_reviews` VALUES
(1,1,1,'{}','asdsada','asdasd','accept',5,NULL,0,'2026-06-03 13:52:54','2026-06-03 13:52:54');
/*!40000 ALTER TABLE `submission_reviews` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` text NOT NULL,
  `prefix` varchar(120) DEFAULT '',
  `subtitle` text DEFAULT NULL,
  `abstract` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Submitted',
  `activity` varchar(100) DEFAULT 'Unassigned',
  `journal_id` varchar(50) DEFAULT 'jcsra',
  `editor_comments` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `views` int(11) DEFAULT 0,
  `scheduled_at` datetime DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `references_list` text DEFAULT NULL,
  `final_file_path` varchar(512) DEFAULT NULL,
  `citations_scopus` int(11) DEFAULT 0,
  `citations_google` int(11) DEFAULT 0,
  `doi` varchar(255) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `submissions` WRITE;
/*!40000 ALTER TABLE `submissions` DISABLE KEYS */;
INSERT INTO `submissions` VALUES
(1,9,'this PDF only dummy','',NULL,NULL,'Declined','Manuscript Declined','jcsra','','2026-06-03 13:48:02',3,'2026-06-03 13:57:00','',NULL,NULL,0,0,NULL,NULL);
/*!40000 ALTER TABLE `submissions` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'author',
  `givenName` varchar(100) DEFAULT NULL,
  `familyName` varchar(100) DEFAULT NULL,
  `affiliation` varchar(255) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `mailingAddress` text DEFAULT NULL,
  `orcid` varchar(100) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'Shubham Salunke','shubh','shubhsalunke01@gmail.com','$2b$10$t6OkJpZ73ldxDUXRGafIv.rddMrLhaprlMmb0pvADwPMwce0.C94G','reviewer','Shubham','Salunke','asdd','BY',NULL,NULL,NULL,NULL,'2026-05-29 08:21:00'),
(2,'Editor (JEISA)','JEISA','JEISA@EISRpress.com','$2b$10$fKrlxbXE72svU9FJAoeZD.dtz2Wx0g9nFUWXsT/TlXnEedO2XG18y','editor',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-30 04:03:27'),
(3,'Editor (JEIML)','JEIML','JEIML@EISRpress.com','$2b$10$U8DLU0TKyDwuVw5pCWiBWutNRGyD97qKzGFcxAkf2UYphMS0Uq3Ku','editor',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-30 04:03:46'),
(4,'System Admin','official.eyeisr','official.eyeisr@gmail.com','$2b$10$t33DCiTmqvgTo18q6cxpkupOHPPTkHozhSiD/Rzf4EA9GrYzzEYnq','admin',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-30 04:04:02'),
(5,'Editor One','editor1','editor1@eisr.com','$2b$10$zTHNs9HdBrd76/OrzutZEev5EgzISdGs8JLEEJ0Yw22QzdwFRdEcS','editor',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-30 06:35:06'),
(6,'Dr. Theyazn Hadi','Theyaznhassnhadi','Theyaznhassnhadi@gmail.com','$2b$10$pzTF6xl8m5VUWRVv4mky..SDjxOeAuhWCqN8R93kMCBCunig5kD7G','reviewer',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-30 06:39:35'),
(7,'Najran Nasser Hamood Aldawla','Najran','dr.najranhamood@gmail.com','$2b$10$cCBb38zz1lIA1.t7RNMWX.76Ckh0BmlbN5GPYmrQifstsuQZHbPk6','author','Najran Nasser Hamood','Aldawla','Al Baha Private College of Science ','SA',NULL,NULL,NULL,NULL,'2026-05-31 20:27:19'),
(8,'theyazn aldhyani','theyaznn','taldhyani@kfu.edu.sa','$2b$10$IBeh9gEVKf6N1M3X6KIi0eUHE784kxzLP8mupUMUkv.N64BFzZ44m','author','theyazn','aldhyani','KFU','SA',NULL,NULL,NULL,NULL,'2026-05-31 21:01:17'),
(9,'email one','email','kappakepapa@gmail.com','$2b$12$k72YwemQYyVWhe1yY34RMeIvzaxyUmYjfoW1gNYvE1rL6ZuXNR4rm','author','email','one ','asdas','BD',NULL,NULL,NULL,NULL,'2026-06-03 13:35:39');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

