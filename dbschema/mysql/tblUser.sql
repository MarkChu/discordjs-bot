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

-- 傾印  表格 jt1ep1buhjqmelpl.tblUser 結構
CREATE TABLE IF NOT EXISTS `tblUser` (
  `uniqid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `authorid` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `authorname` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `isban` int(11) NOT NULL DEFAULT '0',
  `limitdate` datetime DEFAULT '0000-00-00 00:00:00',
  `regdate` datetime DEFAULT '0000-00-00 00:00:00',
  `webhook` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`uniqid`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 正在傾印表格  jt1ep1buhjqmelpl.tblUser 的資料：~9 rows (約數)
/*!40000 ALTER TABLE `tblUser` DISABLE KEYS */;
INSERT INTO `tblUser` (`uniqid`, `userid`, `authorid`, `authorname`, `isban`, `limitdate`, `regdate`, `webhook`) VALUES
	(2, '549573672407531520', '549573672407531520', '펑리수', 0, '2020-12-27 06:27:13', '2019-12-27 14:27:13', NULL),
	(6, '85747967906054144', '85747967906054144', 'markchu929', 0, '2020-12-27 18:36:28', '2019-12-28 02:36:28', NULL),
	(7, '654758657225129984', '654758657225129984', 'wattikman', 0, '2020-12-27 18:37:39', '2019-12-28 02:37:39', NULL),
	(8, '411116448241418261', '411116448241418261', 'AlphaQi', 0, '2020-12-28 13:05:54', '2019-12-28 21:05:54', NULL),
	(9, '634786630518964244', '634786630518964244', 'red egg', 0, '2020-12-29 16:21:39', '2019-12-30 00:21:39', NULL),
	(10, '397055202680766465', '397055202680766465', 'JO', 0, '2020-12-30 05:58:00', '2019-12-30 13:58:00', NULL),
	(11, '571190401516437505', '571190401516437505', 'Kelly', 0, '2020-12-30 13:12:10', '2019-12-30 21:12:10', NULL),
	(12, '566642116072308748', '566642116072308748', 'Eisele', 0, '2020-12-30 13:26:18', '2019-12-30 21:26:18', NULL),
	(13, '444202855986102272', '444202855986102272', 'Chang（法杖）', 0, '2020-12-30 13:26:27', '2019-12-30 21:26:27', NULL),
	(14, '140200930921414656', '140200930921414656', '艾瑞克', 0, '2020-12-30 14:19:56', '2019-12-30 22:19:56', NULL),
	(15, '282778905897730049', '282778905897730049', 'PigPigMan', 0, '2021-04-03 13:27:43', '2020-04-03 21:27:43', NULL),
	(16, '399094610510479361', '399094610510479361', 'Walton||法師||58', 0, '2021-04-09 13:59:40', '2020-04-09 21:59:40', NULL),
	(17, '495617720394711062', '495617720394711062', '瘋狂越南nagervn', 0, '2021-05-25 12:58:24', '2020-05-25 20:58:24', NULL);
/*!40000 ALTER TABLE `tblUser` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
