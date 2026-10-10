-- ============================================================
--  VEHICLE SERVICE MANAGEMENT SYSTEM - DATABASE STRUCTURE
--  Run this script in MySQL Workbench
-- ============================================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS vehicle_service;
USE vehicle_service;

-- 2. Drop old tables (so the script can be run again safely)
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS customers;

-- 3. Table: customers
CREATE TABLE customers (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  name    VARCHAR(100) NOT NULL,
  phone   VARCHAR(15)  NOT NULL,
  email   VARCHAR(100),
  address VARCHAR(200)
);

-- 4. Table: vehicles  (many vehicles belong to one customer)
CREATE TABLE vehicles (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  customer_id   INT NOT NULL,
  vehicle_number VARCHAR(20)  NOT NULL UNIQUE,
  vehicle_model  VARCHAR(100) NOT NULL,
  vehicle_type   VARCHAR(50)  NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 5. Table: services  (many service records belong to one vehicle)
CREATE TABLE services (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  vehicle_id   INT NOT NULL,
  service_date DATE NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  description  VARCHAR(255),
  status       VARCHAR(50) NOT NULL DEFAULT 'Pending',
  cost         DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);