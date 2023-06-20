-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 20, 2023 at 01:15 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_ptmegahera`
--
CREATE DATABASE IF NOT EXISTS `db_ptmegahera` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `db_ptmegahera`;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts` (
  `id_cart` varchar(255) NOT NULL,
  `id_user` varchar(255) NOT NULL,
  `id_product` varchar(255) NOT NULL,
  `productName` varchar(255) NOT NULL,
  `productPrice` int(30) NOT NULL,
  `quantity` int(30) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id_cart`, `id_user`, `id_product`, `productName`, `productPrice`, `quantity`, `created_at`) VALUES
('CRT001', 'CST001', 'PRD001', 'AS', 15000, 5, '2023-06-07 21:09:37'),
('CRT002', 'CST001', 'PRD001', 'AS', 15000, 2, '2023-06-07 22:42:11'),
('CRT003', 'CST001', 'PRD001', 'AS', 15000, 3, '2023-06-07 23:32:26');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id_category` varchar(255) NOT NULL,
  `categoryName` varchar(255) NOT NULL,
  `categoryDesc` varchar(255) NOT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id_category`, `categoryName`, `categoryDesc`, `status`) VALUES
('CAT001', 'lampu', '123', 1);

-- --------------------------------------------------------

--
-- Table structure for table `developer`
--

DROP TABLE IF EXISTS `developer`;
CREATE TABLE `developer` (
  `id_developer` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `balance` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id_order` varchar(255) NOT NULL,
  `id_user` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `courier` varchar(255) NOT NULL,
  `deliverType` varchar(255) NOT NULL,
  `deliverFee` int(13) NOT NULL,
  `province` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `zipCode` varchar(255) NOT NULL,
  `phone` int(16) NOT NULL,
  `note` text NOT NULL,
  `total` int(13) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id_product` varchar(255) NOT NULL,
  `id_supplier` varchar(255) NOT NULL,
  `id_category` varchar(255) NOT NULL,
  `sku` varchar(255) NOT NULL,
  `productName` varchar(255) NOT NULL,
  `productDesc` varchar(255) NOT NULL,
  `productPrice` int(30) NOT NULL,
  `productQuantity` int(30) NOT NULL,
  `productPicture` varchar(255) NOT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id_product`, `id_supplier`, `id_category`, `sku`, `productName`, `productDesc`, `productPrice`, `productQuantity`, `productPicture`, `status`) VALUES
('PRD001', 'SUP001', 'CAT001', 'HANLAMPSKN001', 'LAMP E', 'asss', 12, 123, 'picture-1685290068104-679078337.jpg', 1),
('PRD002', 'SUP001', 'CAT001', 'HANLAMPSKN002', 'OWI', 'asss', 12, 123, 'picture-1685290068104-679078337.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20230620110815-create-shippings.js');

-- --------------------------------------------------------

--
-- Table structure for table `shippings`
--

DROP TABLE IF EXISTS `shippings`;
CREATE TABLE `shippings` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `fee_shippings` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shippings`
--

INSERT INTO `shippings` (`id`, `company_name`, `fee_shippings`, `createdAt`, `updatedAt`) VALUES
(1, 'JNT', 35000, '2023-06-20 11:13:04', '2023-06-20 11:13:04'),
(2, 'DHL', 50000, '2023-06-20 11:13:18', '2023-06-20 11:13:18'),
(3, 'JNE', 40000, '2023-06-20 11:13:27', '2023-06-20 11:13:27'),
(4, 'NINJA  EXPRESS', 70000, '2023-06-20 11:13:52', '2023-06-20 11:13:52'),
(5, 'WAHANA', 70000, '2023-06-20 11:14:00', '2023-06-20 11:14:00');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
  `id_supplier` varchar(255) NOT NULL,
  `companyName` varchar(255) NOT NULL,
  `companyLogo` varchar(255) NOT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id_supplier`, `companyName`, `companyLogo`, `status`) VALUES
('SUP001', 'Hannochs', '1685284938931.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id_user` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `email`, `username`, `password`, `firstName`, `lastName`, `birthdate`, `address`, `city`, `province`, `phone`, `status`) VALUES
('ADMIN', 'admin@ptmegahera.com', NULL, '$2b$10$4dehBosAggDNkEJmBeYcYOxsX7kkw7QmhoQtT4SjuHRVoJEgmA14q', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
('CST001', 'varg@gmail.com', 'kegelapans', '$2b$10$l.sFxWfsP.KmT4tgR7FaOuRjpoFPlnAkT5EKsQHnb1ZGBXotbJrc2', 'adu', 'adududu', '2021-12-04', 'adududud', 'adudud', 'adududu', '123123', 1),
('CST002', 'baksobakar@yuhu.com', 'baksobakar', '$2b$10$.wTL94HCT5.gpkx1sbQsr.25NyXKL86D3Pxi6KE8dX0kHKHLWKuOe', 'bakso', 'bakar', '2000-04-04', 'Jalan baru tapi ga lama', 'Sidoarjo', 'Jawa Timur', '08123456789', 1),
('CST003', 'test1@gmail.com', 'test1', '$2b$10$RwGTwJFUutzQYNtOwKJ1mOpm.JbuZdiBNmvS3BLEFctdvVzxu31zS', 'test', '1', '2021-12-04', 'adududud', 'adudud', 'adududu', '123123', 1),
('CST004', 'test2@gmail.com', 'test2', '$2b$10$3uTewlGZfhgVSYIWzD2oJe1QbTcm2Xnes5wb4gMyqpspD.KMl.1Lu', 'test', '2', '2021-12-04', 'adududud', 'adudud', 'adududu', '123123', 1),
('CST005', 'test3@gmail.com', 'test3', '$2b$10$iZjxdh2bhM8hng4Q0dqbNez4MBJCYpecJ5eZkkm8lzwVcuWwBa1Eq', 'test', '3', '2021-12-04', 'adududud', 'adudud', 'adududu', '123123', 1),
('CST006', 'test4@gmail.com', 'test4', '$2b$10$dmaNFNfDSv5F.3g1WJTQIexVwc8bQZmG3CRsHfmwhT3GHVyF9V/yi', 'test', '4', '2021-12-04', 'adududud', 'adudud', 'adududu', '123123', 1),
('CST007', 'test5@gmail.com', 'test5', '$2b$10$C1IauVpGSxL.JbHqxtV19eS1hG2dBArkYc/41j7QZurXNg8tSJCu2', 'test', '5', '2021-12-04', 'adududud', 'adudud', 'adududu', '123123', 1),
('STF001', 'kuntowijo@ptmegahera.com', 'kuntowijo', '$2b$10$ujXcDIIGTjPxDiw4CI98T.LxTinR32y5Yc8JcDCvmdln/kZXZZtO6', 'Kunto', 'Wijoyo', '1995-12-03', 'Jalan Olahraga 5 No. 7', 'Surabaya', 'Jawa Timur', '08135155321', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id_cart`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id_category`);

--
-- Indexes for table `developer`
--
ALTER TABLE `developer`
  ADD PRIMARY KEY (`id_developer`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id_order`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id_product`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `shippings`
--
ALTER TABLE `shippings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id_supplier`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `shippings`
--
ALTER TABLE `shippings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
