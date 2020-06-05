-- --------------------------------------------------------
-- 主機:                           ffn96u87j5ogvehy.cbetxkdyhwsb.us-east-1.rds.amazonaws.com
-- 伺服器版本:                        5.7.23-log - Source distribution
-- 伺服器操作系統:                      Linux
-- HeidiSQL 版本:                  10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 傾印  表格 jt1ep1buhjqmelpl.tblChannelWebhook 結構
CREATE TABLE IF NOT EXISTS `tblChannelWebhook` (
  `uniqid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `server` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `channel` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `wbname` varchar(120) COLLATE utf8_unicode_ci DEFAULT NULL,
  `wbid` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `wbtoken` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ison` varchar(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`uniqid`),
  UNIQUE KEY `索引 2` (`userid`,`server`,`channel`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 正在傾印表格  jt1ep1buhjqmelpl.tblChannelWebhook 的資料：~2 rows (約數)
/*!40000 ALTER TABLE `tblChannelWebhook` DISABLE KEYS */;
INSERT INTO `tblChannelWebhook` (`uniqid`, `userid`, `server`, `channel`, `wbname`, `wbid`, `wbtoken`, `ison`, `create_date`) VALUES
	(8, '85747967906054144', '652428576251052032', '695620037981110382', '小馬怪通知 at 機器人_85747967906054144', '695620716220907590', 'lF908QkX-4tpNibVNxPiW9fl8snzB0T49w3B5RhqT6v-PigodKd00D1IXT4xlsrEgk_m', 'Y', '2020-04-03 21:08:23'),
	(9, '85747967906054144', '661208151865032710', '661208151865032715', '小馬怪通知 at 一般_85747967906054144', '695656768704872458', 'X_9aq3JvCHaQDTmQ-zwXTkaeoSn700ZTZISAcXAaO1A6tBaJxdgBj2Sg7qPNzKUEGwiz', 'Y', '2020-04-03 23:31:38'),
	(10, '85747967906054144', '653536223553388562', '653965989083480064', '小馬怪通知 at 野王重生通知_85747967906054144', '695657004248596554', 'bXjxCV4RA4EEzpj5o6CLrr-yHHZXwe7eQcX8J16qtIdHzfY_v282O7MEEQmbG-8Z6wWs', 'Y', '2020-04-03 23:32:34');
/*!40000 ALTER TABLE `tblChannelWebhook` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
