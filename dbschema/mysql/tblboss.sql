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

-- 傾印  表格 jt1ep1buhjqmelpl.tblboss 結構
CREATE TABLE IF NOT EXISTS `tblboss` (
  `uniqid` int(11) NOT NULL AUTO_INCREMENT,
  `bossid` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bossname_kr` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bossname` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `location_kr` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `location` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lv` int(11) DEFAULT NULL,
  `imgurl` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cycletime` decimal(10,1) DEFAULT NULL,
  `killtime` datetime DEFAULT NULL,
  `reborntime` datetime DEFAULT NULL,
  `bossimg` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `rank` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`uniqid`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 正在傾印表格  jt1ep1buhjqmelpl.tblboss 的資料：~34 rows (約數)
/*!40000 ALTER TABLE `tblboss` DISABLE KEYS */;
INSERT INTO `tblboss` (`uniqid`, `bossid`, `bossname_kr`, `bossname`, `location_kr`, `location`, `lv`, `imgurl`, `cycletime`, `killtime`, `reborntime`, `bossimg`, `rank`) VALUES
	(1, '1-05', '여왕개미', '蟻后', '개미굴 지하 3층', '螞蟻洞3F', 50, 'https://i.imgur.com/S0EuidU.jpg', 6.0, '2020-05-25 18:51:00', '2020-05-26 00:51:00', 'https://i.imgur.com/7TFZ9Ic.jpg', 'r'),
	(2, '3-03', '브래카', '布雷卡', '브래카 소굴', '布雷卡巢穴', 50, 'https://i.imgur.com/m2urz2c.jpg', 2.5, NULL, NULL, 'https://i.imgur.com/03V9Vo9.jpg', 'b'),
	(3, '3-01', '판 나로드', '판 나로드', '고르곤의 화원', '高爾昆的花園', 50, 'https://i.imgur.com/ExyP022.jpg', 3.5, '2019-12-18 06:15:00', '2019-12-18 09:45:00', 'https://i.imgur.com/vWh6EFN.jpg', 'b'),
	(4, '3-02', '마투라', '馬圖拉', '약탈자의 야영지', '掠奪者營地', 50, 'https://i.imgur.com/VPANgDv.jpg', 4.5, '2020-04-12 20:26:00', '2020-04-13 00:56:00', 'https://i.imgur.com/LAv7hVW.jpg', 'b'),
	(5, '3-04', '메두사', '梅杜莎', '메두사의 정원', '梅杜莎庭園', 55, 'https://i.imgur.com/bebc5VT.jpg', 4.0, '2020-05-25 20:48:00', '2020-05-26 00:48:00', 'https://i.imgur.com/pALjW87.jpg', 'r'),
	(6, '3-05', '블랙 릴리', '블랙 릴리', '죽음의 회랑', '死亡迴廊', 65, 'https://i.imgur.com/0M1Ac1q.jpg', 4.0, '2020-05-25 21:47:00', '2020-05-26 01:47:00', 'https://i.imgur.com/2rQZEAK.jpg', 'r'),
	(7, '3-06', '베히모스', '베히모스', '용의 계곡 북부', '龍之谷', 65, 'https://i.imgur.com/2Gmt1NI.jpg', 6.0, '2020-04-12 19:12:00', '2020-04-13 01:12:00', 'https://i.imgur.com/WqaCS7a.jpg', 'r'),
	(8, '3-07', '드래곤 비스트', '드래곤 비스트', '안타라스의 동굴 지하 6층', '安塔瑞斯洞窟6F', 70, 'https://i.imgur.com/HXZSW13.jpg', 12.0, '2019-12-18 06:15:00', '2019-12-18 18:15:00', 'https://i.imgur.com/aAzKyim.jpg', 'p'),
	(9, '2-01', '판 드라이드', '판 드라이드', '디온구릉지', '狄恩丘陵', 40, 'https://i.imgur.com/hRA3bkd.jpg', 6.0, '2020-04-12 22:16:00', '2020-04-13 04:16:00', 'https://i.imgur.com/Ese1VQO.jpg', 'b'),
	(10, '2-02', '티미트리스', '티미트리스', '플로란 개간지', '芙蘿蘭開墾地', 40, 'https://i.imgur.com/7nIV4UX.jpg', 8.0, '2019-12-18 06:15:00', '2019-12-18 14:15:00', 'https://i.imgur.com/g79y21d.jpg', 'r'),
	(11, '2-03', '탈라킨', '탈라킨', '반란군 아지트', '叛軍根據地', 40, 'https://i.imgur.com/Bn0sIxE.jpg', 5.0, '2020-05-25 18:55:00', '2020-05-25 23:55:00', 'https://i.imgur.com/KyKxptw.jpg', 'r'),
	(12, '2-04', '펠리스', '貓皇后', '비하이브', '蜂巢', 40, 'https://i.imgur.com/pZFLQSF.jpg', 3.0, '2020-04-08 15:05:00', '2020-04-08 18:05:00', 'https://i.imgur.com/kSVax1V.jpg', 'b'),
	(13, '2-05', '엔쿠라', '엔쿠라', '디온 목초지', '狄恩草原', 40, 'https://i.imgur.com/cnKr0NY.jpg', 4.0, '2020-04-03 22:35:52', '2020-04-04 02:35:52', 'https://i.imgur.com/KMT1ubK.jpg', 'b'),
	(14, '2-06', '템페스트', '템페스트', '시체처리소', '刑場', 45, 'https://i.imgur.com/xhfiM8j.jpg', 3.0, '2020-04-11 21:56:00', '2020-04-12 00:56:00', 'https://i.imgur.com/WvsRvxn.jpg', 'b'),
	(15, '2-07', '사르카', '사르카', '델루 리자드맨 서식지', '蘭克理扎德人棲息地', 45, 'https://i.imgur.com/j7GVQsq.jpg', 5.0, '2020-05-25 19:57:00', '2020-05-26 00:57:00', 'https://i.imgur.com/NW1FArK.jpg', 'b'),
	(16, '2-08', '스탄', '스탄', '거인의 흔적', '巨人之路', 45, 'https://i.imgur.com/d58HAbA.jpg', 7.0, '2020-05-25 15:45:00', '2020-05-25 22:45:00', 'https://i.imgur.com/VbgscAg.jpg', 'r'),
	(17, '2-09', '크루마', '크루마', '크루마 습지', '克魯瑪沼澤', 50, 'https://i.imgur.com/ZIOCcjx.jpg', 8.0, '2020-05-09 15:58:00', '2020-05-09 23:58:00', 'https://i.imgur.com/F3Z4RxI.jpg', 'r'),
	(18, '2-10', '코어 수스켑터', '코어 수스켑터', '크루마 탑 지하 7층', '克魯瑪高塔7F', 60, 'https://i.imgur.com/QziTPvz.jpg', 10.0, '2019-12-18 06:15:00', '2019-12-18 16:15:00', 'https://i.imgur.com/UuWBblx.jpg', 'p'),
	(19, '1-01', '체르투바', '체르투바', '체르투바의 막사', '切爾圖巴的軍營', 40, 'https://i.imgur.com/TPmgNku.jpg', 3.0, '2020-04-12 21:57:00', '2020-04-13 00:57:00', 'https://i.imgur.com/J0IcVZ6.jpg', 'b'),
	(20, '1-02', '바실라', '바실라', '황무지 남부', '南部荒地', 40, 'https://i.imgur.com/Q2046Nt.jpg', 4.0, '2020-05-25 18:13:00', '2020-05-25 22:13:00', 'https://i.imgur.com/oiCmnlW.jpg', 'b'),
	(21, '1-03', '켈소스', '켈소스', '절망의 폐허', '絕望的廢墟', 40, 'https://i.imgur.com/oO0c7mc.jpg', 5.0, '2020-04-12 02:06:00', '2020-04-12 07:06:00', 'https://i.imgur.com/vtsem08.jpg', 'b'),
	(22, '1-04', '사반', '사반', '개미굴 지하 2층', '螞蟻洞2F', 45, 'https://i.imgur.com/CJ4JAiT.jpg', 12.0, '2020-04-19 17:24:00', '2020-04-20 05:24:00', 'https://i.imgur.com/jJgEhcA.jpg', 'r'),
	(23, '2-11', '오염된 크루마', '오염된 크루마', '크루마 탑 지하 3층', '克魯瑪高塔3F', 45, 'https://i.imgur.com/QziTPvz.jpg', 8.0, '2020-04-18 14:19:48', '2020-04-18 22:19:48', NULL, 'b'),
	(24, '2-12', '카탄', '카탄', '크루마 탑 지하 6층', '克魯瑪高塔6F', 55, 'https://i.imgur.com/QziTPvz.jpg', 10.0, '2020-05-09 15:29:43', '2020-05-10 01:29:43', NULL, 'r'),
	(25, '1-06', '트롬바', '트롬바', '피의 늪지대', '피의 늪지대', 60, NULL, 3.5, NULL, NULL, NULL, 'b'),
	(26, '4-01', '탈킨', '탈킨', '레토 리자드맨 부락', '레토 리자드맨 부락', 65, NULL, 4.0, '2020-04-15 23:38:00', '2020-04-16 03:38:00', NULL, 'b'),
	(27, '4-02', '셀루', '셀루', '파아그리오의 제단', '파아그리오의 제단', 65, NULL, 6.0, NULL, NULL, NULL, 'r'),
	(28, '4-03', '발보', '발보', '산적 산채', '산적 산채', 70, NULL, 6.0, '2020-05-26 12:53:00', '2020-05-26 18:53:00', NULL, 'r'),
	(29, '4-04', '티미니엘', '티미니엘', '티미니엘의 보금자리	', '티미니엘의 보금자리	', 75, NULL, 8.0, '2020-05-28 12:14:00', '2020-05-28 20:14:00', NULL, 'r'),
	(30, '4-05', '레피로', '레피로', '포자 확산지', '포자 확산지', 75, NULL, 7.0, NULL, NULL, NULL, 'r'),
	(31, '4-06', '오르펜', '오르펜', '오르펜의 둥지', '오르펜의 둥지', 90, NULL, 24.0, NULL, NULL, NULL, 'p'),
	(32, '4-07', '바람의 프라인 장로', '바람의 프라인 장로', '상아탑 1층', '상아탑 1층', 80, NULL, NULL, NULL, NULL, NULL, 'r'),
	(33, '4-08', '코룬', '코룬', '상아탑 2층', '상아탑 2층', 80, NULL, 6.0, NULL, NULL, NULL, 'r'),
	(34, '4-09', '불의 프라인 장로', '불의 프라인 장로', '상아탑 2층', '상아탑 2층', 84, NULL, NULL, NULL, NULL, NULL, 'b');
/*!40000 ALTER TABLE `tblboss` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
