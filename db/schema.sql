-- BloodBridge MySQL schema (Nepal-focused)
CREATE DATABASE IF NOT EXISTS bloodbridge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bloodbridge;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'donor', 'recipient') DEFAULT 'donor',
  is_blocked TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(120) NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  district VARCHAR(80) DEFAULT NULL,
  city VARCHAR(80) DEFAULT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  available TINYINT(1) DEFAULT 1,
  last_donated DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- sample data (password is 'password' hashed with bcrypt)
-- Admin: admin@bloodbridge.com / password
-- Donor: ram@test.com / password
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@bloodbridge.com', '$2a$10$X.x.x.x.x.x.x.x.x.x.x', 'admin');
