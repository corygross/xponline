-- phpMyAdmin SQL Dump
-- version 2.10.1
-- http://www.phpmyadmin.net
-- 
-- Host: localhost
-- Generation Time: Oct 08, 2008 at 09:27 PM
-- Server version: 5.0.45
-- PHP Version: 5.2.5

-- 
-- Database: `xponline`
-- 
-- CREATE DATABASE `xponline` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE xponline;

-- --------------------------------------------------------

-- 
-- Table structure for table `access`
-- 

DROP TABLE IF EXISTS `access`;
CREATE TABLE IF NOT EXISTS `access` (
  `dID` int(11) NOT NULL,
  `uID` int(11) NOT NULL,
  `accessLvl` enum('r','w') collate utf8_unicode_ci NOT NULL default 'r',
  PRIMARY KEY  (`dID`),
  KEY `uID` (`uID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 
-- Dumping data for table `access`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `contacts`
-- 

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `uID1` int(11) NOT NULL,
  `uID2` int(11) NOT NULL,
  `u1accept` tinyint(1) NOT NULL default '0',
  `u2accept` tinyint(1) NOT NULL default '0',
  PRIMARY KEY  (`uID1`,`uID2`),
  KEY `uID2` (`uID2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 
-- Dumping data for table `contacts`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `documents`
-- 

DROP TABLE IF EXISTS `documents`;
CREATE TABLE IF NOT EXISTS `documents` (
  `dID` int(11) NOT NULL auto_increment,
  `dName` varchar(32) collate utf8_unicode_ci default NULL,
  `dLocation` varchar(128) collate utf8_unicode_ci default NULL,
  PRIMARY KEY  (`dID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- 
-- Dumping data for table `documents`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `msgqueue`
-- 

DROP TABLE IF EXISTS `msgqueue`;
CREATE TABLE IF NOT EXISTS `msgqueue` (
  `mID` int(11) NOT NULL auto_increment,
  `fromID` int(11) NOT NULL,
  `toID` int(11) NOT NULL,
  `msg` varchar(256) collate utf8_unicode_ci NOT NULL,
  `sentTime` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`mID`),
  KEY `fromID` (`fromID`),
  KEY `toID` (`toID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- 
-- Dumping data for table `msgqueue`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `users`
-- 

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `uID` int(11) NOT NULL auto_increment,
  `uFName` varchar(32) collate utf8_unicode_ci NOT NULL,
  `uLName` varchar(32) collate utf8_unicode_ci NOT NULL,
  `uEmail` varchar(32) collate utf8_unicode_ci NOT NULL,
  `uPass` char(32) collate utf8_unicode_ci NOT NULL,
  `uColor` enum('black','blue') collate utf8_unicode_ci NOT NULL default 'black',
  PRIMARY KEY  (`uID`),
  UNIQUE KEY `uEmail` (`uEmail`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=10 ;

-- 
-- Dumping data for table `users`
-- 

INSERT INTO `users` (`uID`, `uFName`, `uLName`, `uEmail`, `uPass`, `uColor`) VALUES 
(7, 'Cory', 'Gross', 'corygross@hotmail.com', 'dfa9e8660763fd9453cbe56eebff2e39', 'black'),
(8, 'Cory', 'Gross', 'cor', 'e10adc3949ba59abbe56e057f20f883e', 'black'),
(9, 'Bob', 'Villa', 'bv@hotmail.com', 'dfa9e8660763fd9453cbe56eebff2e39', 'black');

-- 
-- Constraints for dumped tables
-- 

-- 
-- Constraints for table `access`
-- 
ALTER TABLE `access`
  ADD CONSTRAINT `access_ibfk_1` FOREIGN KEY (`dID`) REFERENCES `documents` (`dID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `access_ibfk_2` FOREIGN KEY (`uID`) REFERENCES `users` (`uID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- Constraints for table `contacts`
-- 
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts_ibfk_2` FOREIGN KEY (`uID2`) REFERENCES `users` (`uID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`uID1`) REFERENCES `users` (`uID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- Constraints for table `msgqueue`
-- 
ALTER TABLE `msgqueue`
  ADD CONSTRAINT `msgqueue_ibfk_1` FOREIGN KEY (`fromID`) REFERENCES `users` (`uID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `msgqueue_ibfk_2` FOREIGN KEY (`toID`) REFERENCES `users` (`uID`) ON DELETE CASCADE ON UPDATE CASCADE;
