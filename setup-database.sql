-- Database Setup Script for STEMAI Booth Visit System
-- Run this before deploying the application

-- Create database
CREATE DATABASE IF NOT EXISTS `booth-visit-db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create dedicated user for the application
-- IMPORTANT: Change 'your_secure_password' to a strong password
CREATE USER IF NOT EXISTS 'booth_user'@'localhost' 
IDENTIFIED BY 'your_secure_password';

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON `booth-visit-db`.* TO 'booth_user'@'localhost';

-- Apply privilege changes
FLUSH PRIVILEGES;

-- Show databases to verify
SHOW DATABASES;

-- Use the database
USE `booth-visit-db`;

-- Show that database is empty (no tables yet - Prisma will create them)
SHOW TABLES;
