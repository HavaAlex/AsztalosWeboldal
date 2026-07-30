-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 30. Jul 2026 um 12:26
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `ateotthonod`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `categories`
--

CREATE TABLE `categories` (
  `ID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `categories`
--

INSERT INTO `categories` (`ID`, `name`) VALUES
(9, 'Szekrények'),
(11, 'Konyhaszekrény'),
(12, 'Gardróbszekrény'),
(13, 'Lépcsők');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `categoryconnections`
--

CREATE TABLE `categoryconnections` (
  `ParentID` int(11) NOT NULL,
  `ChildID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `categoryconnections`
--

INSERT INTO `categoryconnections` (`ParentID`, `ChildID`) VALUES
(9, 11),
(9, 12);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `images`
--

CREATE TABLE `images` (
  `ID` int(11) NOT NULL,
  `postID` int(11) NOT NULL,
  `filename` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `images`
--

INSERT INTO `images` (`ID`, `postID`, `filename`) VALUES
(6, 5, '20210328_122438.jpg'),
(7, 6, '20220520_082123.jpg'),
(8, 6, '20220520_082157.jpg'),
(9, 6, '20220520_082144.jpg'),
(10, 7, '20201216_144345.jpg'),
(11, 7, '20201216_144418.jpg'),
(14, 10, '20210209_171924.jpg'),
(15, 10, '20210209_171928.jpg'),
(16, 11, '20220404_160713.jpg'),
(17, 11, '20220404_160725.jpg');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `posts`
--

CREATE TABLE `posts` (
  `ID` int(11) NOT NULL,
  `categoryID` int(11) NOT NULL,
  `title` varchar(500) NOT NULL,
  `subtitle` varchar(500) NOT NULL,
  `desc` varchar(1000) NOT NULL,
  `uploadDate` datetime NOT NULL,
  `showOnHomePage` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `posts`
--

INSERT INTO `posts` (`ID`, `categoryID`, `title`, `subtitle`, `desc`, `uploadDate`, `showOnHomePage`) VALUES
(5, 11, 'Újabb elégedett megrendelő', '', '', '2026-07-30 07:53:52', 1),
(6, 11, 'Különleges sarokelem', '', '', '2026-07-30 07:54:58', 1),
(7, 12, '', '', '', '2026-07-30 08:04:24', 0),
(10, 13, '', '', '', '2026-07-30 08:18:42', 0),
(11, 13, 'Különleges lépcső elkészült ', '', '', '2026-07-30 08:19:14', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `username` varchar(60) NOT NULL,
  `password` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`ID`, `username`, `password`) VALUES
(1, 'Alex', '$2b$10$KlWYz39xgI.Qt8vTijKpJOhcGMyEaTB/LzMCKWJjQsrbe3Nbd34YW');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `categoryconnections`
--
ALTER TABLE `categoryconnections`
  ADD PRIMARY KEY (`ParentID`,`ChildID`),
  ADD KEY `ChildID` (`ChildID`);

--
-- Indizes für die Tabelle `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `postID` (`postID`);

--
-- Indizes für die Tabelle `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `categoryID` (`categoryID`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `categories`
--
ALTER TABLE `categories`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT für Tabelle `images`
--
ALTER TABLE `images`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT für Tabelle `posts`
--
ALTER TABLE `posts`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `categoryconnections`
--
ALTER TABLE `categoryconnections`
  ADD CONSTRAINT `categoryconnections_ibfk_1` FOREIGN KEY (`ParentID`) REFERENCES `categories` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `categoryconnections_ibfk_2` FOREIGN KEY (`ChildID`) REFERENCES `categories` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `images`
--
ALTER TABLE `images`
  ADD CONSTRAINT `images_ibfk_1` FOREIGN KEY (`postID`) REFERENCES `posts` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
