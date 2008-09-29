-- phpMyAdmin SQL Dump
-- version 2.10.1
-- http://www.phpmyadmin.net
-- 
-- Host: localhost
-- Generation Time: Sep 29, 2008 at 12:11 AM
-- Server version: 5.0.45
-- PHP Version: 5.2.5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

-- 
-- Database: `xponline`
-- 
DROP DATABASE `xponline`;
CREATE DATABASE `xponline` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `xponline`;

-- --------------------------------------------------------

-- 
-- Table structure for table `access`
-- 

DROP TABLE IF EXISTS `access`;
CREATE TABLE `access` (
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
-- Table structure for table `documents`
-- 

DROP TABLE IF EXISTS `documents`;
CREATE TABLE `documents` (
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
CREATE TABLE `msgqueue` (
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
CREATE TABLE `users` (
  `uID` int(11) NOT NULL auto_increment,
  `uFName` varchar(32) collate utf8_unicode_ci NOT NULL,
  `uLName` varchar(32) collate utf8_unicode_ci NOT NULL,
  `uEmail` varchar(32) collate utf8_unicode_ci NOT NULL,
  `uPass` char(32) collate utf8_unicode_ci NOT NULL,
  `uColor` enum('black','blue') collate utf8_unicode_ci NOT NULL default 'black',
  PRIMARY KEY  (`uID`),
  UNIQUE KEY `uEmail` (`uEmail`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=9 ;

-- 
-- Dumping data for table `users`
-- 

INSERT INTO `users` (`uID`, `uFName`, `uLName`, `uEmail`, `uPass`, `uColor`) VALUES 
(7, 'Cory', 'Gross', 'corygross@hotmail.com', 'dfa9e8660763fd9453cbe56eebff2e39', 'black'),
(8, 'Cory', 'Gross', 'cor', 'e10adc3949ba59abbe56e057f20f883e', 'black');

-- 
-- Constraints for dumped tables
-- 

-- 
-- Constraints for table `access`
-- 
ALTER TABLE `access`
  ADD CONSTRAINT `access_ibfk_2` FOREIGN KEY (`uID`) REFERENCES `users` (`uID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `access_ibfk_1` FOREIGN KEY (`dID`) REFERENCES `documents` (`dID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- Constraints for table `msgqueue`
-- 
ALTER TABLE `msgqueue`
  ADD CONSTRAINT `msgqueue_ibfk_2` FOREIGN KEY (`toID`) REFERENCES `users` (`uID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `msgqueue_ibfk_1` FOREIGN KEY (`fromID`) REFERENCES `users` (`uID`) ON UPDATE CASCADE;
