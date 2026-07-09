
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS uploads;
DROP TABLE IF EXISTS course_repository;
DROP TABLE IF EXISTS semester_repo;
DROP TABLE IF EXISTS repository;
DROP TABLE IF EXISTS access_control;
DROP TABLE IF EXISTS lecture_courses;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Auth / Users table
CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role ENUM('hod', 'lecture') NOT NULL DEFAULT 'lecture',
                       is_verified BOOLEAN DEFAULT FALSE,
                       otp VARCHAR(10),
                       otp_expires_at DATETIME,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Courses table
CREATE TABLE courses (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         code VARCHAR(50) NOT NULL UNIQUE,
                         title VARCHAR(255) NOT NULL,
                         credit_hours INT NOT NULL,
                         description TEXT,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Lecture Courses table
CREATE TABLE lecture_courses (
                                 id INT AUTO_INCREMENT PRIMARY KEY,
                                 user_id INT NOT NULL,
                                 course_id INT NOT NULL,
                                 semester ENUM('1st', '2nd') NOT NULL,
                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                 UNIQUE KEY unique_lecture_course_semester (user_id, course_id, semester),
                                 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                 FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Access Control table
CREATE TABLE access_control (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                user_id INT NOT NULL,
                                course_id INT NOT NULL,
                                access_level ENUM('view', 'download', 'modify') NOT NULL,
                                start_datetime DATETIME,
                                end_datetime DATETIME,
                                note TEXT,
                                status ENUM('approve', 'decline', 'pending') NOT NULL DEFAULT 'pending',
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Repository table
CREATE TABLE repository (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            year INT NOT NULL UNIQUE,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Semester Repository table
CREATE TABLE semester_repo (
                               id INT AUTO_INCREMENT PRIMARY KEY,
                               repository_id INT NOT NULL,
                               name ENUM('1st', '2nd') NOT NULL,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               UNIQUE KEY unique_repo_semester (repository_id, name),
                               FOREIGN KEY (repository_id) REFERENCES repository(id) ON DELETE CASCADE
);

-- Course Repository table
CREATE TABLE course_repository (
                                   id INT AUTO_INCREMENT PRIMARY KEY,
                                   semester_id INT NOT NULL,
                                   course_id INT NOT NULL,
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                   UNIQUE KEY unique_semester_course (semester_id, course_id),
                                   FOREIGN KEY (semester_id) REFERENCES semester_repo(id) ON DELETE CASCADE,
                                   FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Uploads table
CREATE TABLE uploads (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         course_repository_id INT NOT NULL,
                         lecture_id INT NOT NULL,
                         file_path VARCHAR(500) NOT NULL,
                         index_number VARCHAR(500) NOT NULL,
                         serial_number VARCHAR(50),
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         FOREIGN KEY (course_repository_id) REFERENCES course_repository(id) ON DELETE CASCADE,
                         FOREIGN KEY (lecture_id) REFERENCES users(id) ON DELETE CASCADE
);
