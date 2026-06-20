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

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` (`admin_id`, `full_name`, `email`, `password_hash`, `phone`, `employee_id`, `role`, `is_verified`, `email_verified_at`, `last_login_at`, `activated_at`, `activated_by`, `deactivated_at`, `deactivated_by`, `deleted_at`, `created_at`, `updated_at`) VALUES (1,'Super','def@gmail.com','$2b$10$H5zjIiQA1qc8pJCZ6T8fnOry7yvf9PhVhD8tKt9LWIMVnL3YHNeBa',NULL,NULL,'super_admin',0,NULL,'2026-04-08 21:31:58.526','2026-04-08 21:27:57.721',NULL,NULL,NULL,NULL,'2026-04-08 21:27:57.727','2026-04-08 21:31:58.527'),
(2,'Ilhem','ilhem@gmail.com','$2b$10$NLhRncoG/H8LptQ1FGCLE.CT84LABQsjXn0SzivZQVhq.RyK37q8m',NULL,NULL,'super_admin',1,NULL,'2026-04-08 22:51:01.971','2026-04-08 21:40:23.000',NULL,NULL,NULL,NULL,'2026-04-08 21:40:23.000','2026-04-08 22:51:01.972');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `blood_alerts` WRITE;
/*!40000 ALTER TABLE `blood_alerts` DISABLE KEYS */;
INSERT INTO `blood_alerts` (`alert_id`, `hospital_id`, `blood_group`, `quantity_units`, `urgency_level`, `status`, `created_by`, `description`, `deleted_at`, `created_at`, `updated_at`) VALUES (1,1,'A_POS',3,'urgent','active',2,'Accident de la route - besoin urgent de sang A+',NULL,'2026-04-01 08:00:00.000','2026-04-08 22:40:44.000'),
(2,1,'O_NEG',5,'urgent','active',2,'Chirurgie cardiaque programmee - donneur universel requis',NULL,'2026-04-02 10:30:00.000','2026-04-08 22:40:44.000'),
(3,2,'B_POS',2,'medium','active',2,'Stock faible en B+ a El Eulma',NULL,'2026-04-03 14:00:00.000','2026-04-08 22:40:44.000'),
(4,4,'AB_POS',1,'low','active',2,'Reconstitution du stock AB+',NULL,'2026-04-04 09:15:00.000','2026-04-08 22:40:44.000'),
(5,3,'A_NEG',4,'urgent','active',2,'Patient en soins intensifs - A- requis en urgence',NULL,'2026-04-05 16:45:00.000','2026-04-08 22:40:44.000'),
(6,6,'O_POS',3,'medium','active',2,'Stock bas en O+ au CHU Batna',NULL,'2026-04-06 11:00:00.000','2026-04-08 22:40:44.000'),
(7,5,'B_NEG',2,'medium','active',2,'Besoin pour operation prevue cette semaine',NULL,'2026-04-07 08:30:00.000','2026-04-08 22:40:44.000'),
(8,1,'A_POS',2,'low','recovered',2,'Stock reconstitue - merci aux donneurs',NULL,'2026-03-20 10:00:00.000','2026-04-08 22:40:44.000'),
(9,7,'O_NEG',3,'urgent','recovered',2,'Urgence resolue - clinique Es-Salem',NULL,'2026-03-25 13:00:00.000','2026-04-08 22:40:44.000'),
(10,2,'AB_NEG',2,'medium','active',2,'Besoin rare AB- pour transfusion',NULL,'2026-04-08 07:00:00.000','2026-04-08 22:40:44.000');
/*!40000 ALTER TABLE `blood_alerts` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `donations` WRITE;
/*!40000 ALTER TABLE `donations` DISABLE KEYS */;
INSERT INTO `donations` (`donation_id`, `user_id`, `alert_id`, `donation_date`, `quantity_units`, `status`, `approved_by`, `created_by`, `updated_by`, `questionnaire_completed`, `notes`, `created_at`, `updated_at`) VALUES (1,1,1,'2026-04-02 09:00:00.000',1,'confirmed',2,1,NULL,1,'Don effectue avec succes','2026-04-01 10:00:00.000','2026-04-08 22:41:11.000'),
(2,2,2,'2026-04-03 10:00:00.000',1,'confirmed',2,2,NULL,1,'Donneur universel O-','2026-04-02 11:00:00.000','2026-04-08 22:41:11.000'),
(3,8,1,'2026-04-02 11:00:00.000',1,'confirmed',2,8,NULL,1,'Deuxieme don pour cette alerte','2026-04-01 14:00:00.000','2026-04-08 22:41:11.000'),
(4,11,1,'2026-04-03 08:30:00.000',1,'confirmed',2,11,NULL,1,'Don matinal','2026-04-02 09:00:00.000','2026-04-08 22:41:11.000'),
(5,6,6,'2026-04-07 14:00:00.000',1,'confirmed',2,6,NULL,1,'Don au CHU Batna','2026-04-06 12:00:00.000','2026-04-08 22:41:11.000'),
(6,10,6,'2026-04-07 15:30:00.000',1,'confirmed',2,10,NULL,1,'Deuxieme donneur O+','2026-04-06 13:00:00.000','2026-04-08 22:41:11.000'),
(7,13,2,'2026-04-04 09:00:00.000',1,'confirmed',2,13,NULL,1,'Don O- pour chirurgie','2026-04-03 10:00:00.000','2026-04-08 22:41:11.000'),
(8,3,3,'2026-04-12 10:00:00.000',1,'planned',NULL,3,NULL,1,'Disponible le matin','2026-04-08 08:00:00.000','2026-04-08 22:41:11.000'),
(9,4,4,'2026-04-13 14:00:00.000',1,'planned',NULL,4,NULL,1,'Rendez-vous confirme','2026-04-08 09:00:00.000','2026-04-08 22:41:11.000'),
(10,5,5,'2026-04-11 08:00:00.000',1,'planned',NULL,5,NULL,1,'Don urgent A-','2026-04-08 10:00:00.000','2026-04-08 22:41:11.000'),
(11,15,5,'2026-04-11 10:00:00.000',1,'planned',NULL,15,NULL,1,'Deuxieme donneur A-','2026-04-08 11:00:00.000','2026-04-08 22:41:11.000'),
(12,7,7,'2026-04-14 09:00:00.000',1,'planned',NULL,7,NULL,1,'Don B- programme','2026-04-08 12:00:00.000','2026-04-08 22:41:11.000'),
(13,12,3,'2026-04-12 11:00:00.000',1,'planned',NULL,12,NULL,1,'Don B+ El Eulma','2026-04-08 13:00:00.000','2026-04-08 22:41:11.000'),
(14,14,4,'2026-04-13 15:30:00.000',1,'planned',NULL,14,NULL,1,'Don AB+ Constantine','2026-04-08 14:00:00.000','2026-04-08 22:41:11.000'),
(15,9,10,'2026-04-10 10:00:00.000',1,'cancelled',NULL,9,NULL,1,'Annule pour raison medicale','2026-04-08 07:00:00.000','2026-04-08 22:41:11.000'),
(16,3,8,'2026-03-21 10:00:00.000',1,'confirmed',2,3,NULL,1,'Don pour ancienne alerte (resolue)','2026-03-20 11:00:00.000','2026-04-08 22:41:11.000'),
(17,2,9,'2026-03-26 14:00:00.000',1,'confirmed',2,2,NULL,1,'Urgence clinique Es-Salem resolue','2026-03-25 14:00:00.000','2026-04-08 22:41:11.000');
/*!40000 ALTER TABLE `donations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `hospitals` WRITE;
/*!40000 ALTER TABLE `hospitals` DISABLE KEYS */;
INSERT INTO `hospitals` (`hospital_id`, `name`, `address`, `city`, `postal_code`, `phone`, `email`, `is_active`, `deleted_at`, `created_at`) VALUES (1,'CHU Setif','Route de Batna, Setif','Setif','19000','0361234567','chu@setif.dz',1,NULL,'2026-04-08 22:39:49.000'),
(2,'EPH El Eulma','Rue principale, El Eulma','El Eulma','19600','0361345678','eph@eleulma.dz',1,NULL,'2026-04-08 22:39:49.000'),
(3,'Hopital Ain Azel','Centre ville, Ain Azel','Ain Azel','19200','0361456789','hopital@ainazel.dz',1,NULL,'2026-04-08 22:39:49.000'),
(4,'CHU Constantine','Boulevard Zighoud Youcef','Constantine','25000','0311234567','chu@constantine.dz',1,NULL,'2026-04-08 22:39:49.000'),
(5,'EPH Bordj Bou Arreridj','Avenue 1er Novembre','BBA','34000','0351234567','eph@bba.dz',1,NULL,'2026-04-08 22:39:49.000'),
(6,'CHU Batna','Route de Biskra','Batna','05000','0331234567','chu@batna.dz',1,NULL,'2026-04-08 22:39:49.000'),
(7,'Clinique Es-Salem','Cite 1000 logements, Setif','Setif','19000','0361567890','essalem@clinic.dz',1,NULL,'2026-04-08 22:39:49.000'),
(8,'EPH Ain Oulmene','Route nationale, Ain Oulmene','Ain Oulmene','19300','0361678901','eph@ainoulmene.dz',0,NULL,'2026-04-08 22:39:49.000');
/*!40000 ALTER TABLE `hospitals` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` (`notification_id`, `user_id`, `notification_type`, `title`, `message`, `sent_at`, `read`, `read_at`) VALUES (1,1,'alert','Alerte sang A+','Besoin urgent de sang A+ au CHU Setif','2026-04-01 08:05:00.000',1,'2026-04-01 09:00:00.000'),
(2,8,'alert','Alerte sang A+','Besoin urgent de sang A+ au CHU Setif','2026-04-01 08:05:00.000',1,'2026-04-01 09:30:00.000'),
(3,11,'alert','Alerte sang A+','Besoin urgent de sang A+ au CHU Setif','2026-04-01 08:05:00.000',1,'2026-04-01 10:00:00.000'),
(4,2,'alert','Alerte sang O-','Besoin urgent de sang O- pour chirurgie cardiaque','2026-04-02 10:35:00.000',1,'2026-04-02 11:00:00.000'),
(5,13,'alert','Alerte sang O-','Besoin urgent de sang O- pour chirurgie cardiaque','2026-04-02 10:35:00.000',1,'2026-04-02 12:00:00.000'),
(6,3,'alert','Alerte sang B+','Stock faible en B+ a EPH El Eulma','2026-04-03 14:05:00.000',1,'2026-04-03 15:00:00.000'),
(7,12,'alert','Alerte sang B+','Stock faible en B+ a EPH El Eulma','2026-04-03 14:05:00.000',1,'2026-04-03 15:30:00.000'),
(8,4,'alert','Alerte sang AB+','Reconstitution du stock AB+ a Constantine','2026-04-04 09:20:00.000',1,'2026-04-04 10:00:00.000'),
(9,14,'alert','Alerte sang AB+','Reconstitution du stock AB+ a Constantine','2026-04-04 09:20:00.000',0,NULL),
(10,5,'alert','Alerte sang A-','Patient en soins intensifs - A- requis','2026-04-05 16:50:00.000',1,'2026-04-05 17:00:00.000'),
(11,15,'alert','Alerte sang A-','Patient en soins intensifs - A- requis','2026-04-05 16:50:00.000',1,'2026-04-05 17:30:00.000'),
(12,6,'alert','Alerte sang O+','Stock bas en O+ au CHU Batna','2026-04-06 11:05:00.000',1,'2026-04-06 11:30:00.000'),
(13,10,'alert','Alerte sang O+','Stock bas en O+ au CHU Batna','2026-04-06 11:05:00.000',1,'2026-04-06 12:00:00.000'),
(14,7,'alert','Alerte sang B-','Besoin B- pour operation a BBA','2026-04-07 08:35:00.000',1,'2026-04-07 09:00:00.000'),
(15,9,'alert','Alerte sang AB-','Besoin rare AB- pour transfusion a El Eulma','2026-04-08 07:05:00.000',0,NULL),
(16,3,'reminder','Rappel don','Votre don est prevu pour le 12 avril','2026-04-08 08:00:00.000',0,NULL),
(17,5,'reminder','Rappel don','Votre don urgent A- est prevu pour le 11 avril','2026-04-08 08:00:00.000',0,NULL),
(18,7,'reminder','Rappel don','Votre don B- est prevu pour le 14 avril','2026-04-08 08:00:00.000',0,NULL),
(19,1,'info','Merci pour votre don!','Votre don de sang A+ a ete confirme. Merci!','2026-04-02 15:00:00.000',1,'2026-04-02 16:00:00.000'),
(20,6,'info','Merci pour votre don!','Votre don de sang O+ a ete confirme. Merci!','2026-04-07 18:00:00.000',1,'2026-04-07 19:00:00.000'),
(21,2,'info','Don confirme','Votre don O- a ete utilise avec succes','2026-04-04 10:00:00.000',1,'2026-04-04 11:00:00.000');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `questionnaires` WRITE;
/*!40000 ALTER TABLE `questionnaires` DISABLE KEYS */;
/*!40000 ALTER TABLE `questionnaires` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `user_blood_alert` WRITE;
/*!40000 ALTER TABLE `user_blood_alert` DISABLE KEYS */;
INSERT INTO `user_blood_alert` (`user_id`, `alert_id`, `notified_at`, `confirmed`, `date_confirmed`) VALUES (1,1,'2026-04-01 08:05:00.000',1,'2026-04-01 09:00:00.000'),
(2,2,'2026-04-02 10:35:00.000',1,'2026-04-02 11:00:00.000'),
(3,3,'2026-04-03 14:05:00.000',1,'2026-04-03 15:00:00.000'),
(4,4,'2026-04-04 09:20:00.000',1,'2026-04-04 10:00:00.000'),
(5,5,'2026-04-05 16:50:00.000',1,'2026-04-05 17:00:00.000'),
(6,6,'2026-04-06 11:05:00.000',1,'2026-04-06 11:30:00.000'),
(7,7,'2026-04-07 08:35:00.000',1,'2026-04-07 09:00:00.000'),
(8,1,'2026-04-01 08:05:00.000',1,'2026-04-01 09:30:00.000'),
(9,10,'2026-04-08 07:05:00.000',0,NULL),
(10,6,'2026-04-06 11:05:00.000',1,'2026-04-06 12:00:00.000'),
(11,1,'2026-04-01 08:05:00.000',1,'2026-04-01 10:00:00.000'),
(12,3,'2026-04-03 14:05:00.000',1,'2026-04-03 15:30:00.000'),
(13,2,'2026-04-02 10:35:00.000',1,'2026-04-02 12:00:00.000'),
(14,4,'2026-04-04 09:20:00.000',1,'2026-04-04 10:30:00.000'),
(15,5,'2026-04-05 16:50:00.000',1,'2026-04-05 17:30:00.000');
/*!40000 ALTER TABLE `user_blood_alert` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`user_id`, `full_name`, `email`, `password`, `phone_number`, `address`, `blood_group`, `birth_date`, `gender`, `last_donation_date`, `is_regular_donor`, `email_verified_at`, `is_verified`, `last_login_at`, `created_at`, `deleted_at`, `updated_at`) VALUES (1,'Ahmed Benali','ahmed@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0551234567','Cite 1000 logements, Setif','A_POS','1990-03-15 00:00:00.000','male',NULL,1,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000'),
(2,'Fatima Zahra','fatima@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0662345678','Hai El Maabouda, Setif','O_NEG','1995-07-22 00:00:00.000','female',NULL,1,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000'),
(3,'Karim Mesbah','karim@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0773456789','Rue de la Gare, Constantine','B_POS','1988-11-03 00:00:00.000','male',NULL,0,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000'),
(4,'Amina Boudiaf','amina@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0554567890','Cite Bel Air, El Eulma','AB_POS','1992-01-28 00:00:00.000','female',NULL,1,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000'),
(5,'Youcef Khelifi','youcef@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0665678901','Centre ville, Batna','A_NEG','1985-09-10 00:00:00.000','male',NULL,0,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000'),
(6,'Sara Hamidi','sara@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0776789012','Hai Chouhada, BBA','O_POS','1998-04-17 00:00:00.000','female',NULL,1,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000'),
(7,'Mohamed Larbi','mohamed@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0557890123','Ain Azel centre','B_NEG','1993-12-05 00:00:00.000','male',NULL,1,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000'),
(8,'Nadia Slimani','nadia@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0668901234','Cite des Oliviers, Setif','A_POS','1991-06-30 00:00:00.000','female',NULL,0,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000'),
(9,'Rachid Benmoussa','rachid@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0779012345','Boulevard Zighoud, Constantine','AB_NEG','1987-08-14 00:00:00.000','male',NULL,1,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000'),
(10,'Lina Messaoudi','lina@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0550123456','Rue Didouche Mourad, Setif','O_POS','1996-02-20 00:00:00.000','female',NULL,1,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000'),
(11,'Hichem Cherif','hichem@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0661234567','Hai El Hidhab, Setif','A_POS','1994-10-08 00:00:00.000','male',NULL,0,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000'),
(12,'Meriem Touati','meriem@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0772345678','Cite 20 Aout, El Eulma','B_POS','1997-05-25 00:00:00.000','female',NULL,1,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000'),
(13,'Amine Ferhat','amine@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0553456789','Route de Setif, Ain Oulmene','O_NEG','1989-07-11 00:00:00.000','male',NULL,1,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000'),
(14,'Yasmine Bouzid','yasmine@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0664567890','Centre ville, Setif','AB_POS','2000-03-03 00:00:00.000','female',NULL,0,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000'),
(15,'Bilal Ziani','bilal@gmail.com','$2b$10$NEvQ9TuOaG1jTuO6k/m0IeoDS4/yamO9NK8416Go3jmaju9NHZbs2','0775678901','Hai Maachi, Batna','A_NEG','1986-11-19 00:00:00.000','male',NULL,1,'2026-04-08 22:40:24.000',1,NULL,'2026-04-08 22:40:24.000',NULL,'2026-04-08 22:40:24.000');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

