-- Pet Adoption Center Database Schema

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS Adoption CASCADE;
DROP TABLE IF EXISTS Application CASCADE;
DROP TABLE IF EXISTS Staff CASCADE;
DROP TABLE IF EXISTS Pet CASCADE;
DROP TABLE IF EXISTS Shelter CASCADE;
DROP TABLE IF EXISTS Adopter CASCADE;

-- Create Adopter table
CREATE TABLE Adopter (
    adopter_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    housing_type VARCHAR(50) CHECK (housing_type IN ('house', 'apartment', 'condo', 'other')),
    has_yard BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Shelter table
CREATE TABLE Shelter (
    shelter_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Pet table
CREATE TABLE Pet (
    pet_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    breed VARCHAR(50),
    age INTEGER CHECK (age >= 0),
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Unknown')),
    color VARCHAR(30),
    species VARCHAR(30) NOT NULL CHECK (species IN ('Dog', 'Cat', 'Bird', 'Rabbit', 'Other')),
    weight DECIMAL(5,2) CHECK (weight > 0),
    size VARCHAR(20) CHECK (size IN ('Small', 'Medium', 'Large', 'Extra Large')),
    status VARCHAR(20) DEFAULT 'Available' CHECK (status IN ('Available', 'Adopted', 'Pending', 'Medical Care', 'Reserved')),
    shelter_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shelter_id) REFERENCES Shelter(shelter_id) ON DELETE CASCADE
);

-- Create Staff table
CREATE TABLE Staff (
    staff_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Manager', 'Veterinarian', 'Caretaker', 'Administrator', 'Volunteer')),
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
    shelter_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shelter_id) REFERENCES Shelter(shelter_id) ON DELETE CASCADE
);

-- Create Application table
CREATE TABLE Application (
    application_id SERIAL PRIMARY KEY,
    adopter_id INTEGER NOT NULL,
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Under Review')),
    preferred_pet_age VARCHAR(20) CHECK (preferred_pet_age IN ('Puppy/Kitten', 'Young', 'Adult', 'Senior', 'Any')),
    experience_level VARCHAR(20) CHECK (experience_level IN ('First Time', 'Some Experience', 'Experienced', 'Expert')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (adopter_id) REFERENCES Adopter(adopter_id) ON DELETE CASCADE
);

-- Create Adoption table
CREATE TABLE Adoption (
    adoption_id SERIAL PRIMARY KEY,
    adopter_id INTEGER NOT NULL,
    pet_id INTEGER NOT NULL,
    adoption_date DATE NOT NULL DEFAULT CURRENT_DATE,
    adoption_fee DECIMAL(10,2) NOT NULL CHECK (adoption_fee >= 0),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'Completed' CHECK (status IN ('Completed', 'Trial Period', 'Returned', 'Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (adopter_id) REFERENCES Adopter(adopter_id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES Pet(pet_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_pet_status ON Pet(status);
CREATE INDEX idx_pet_shelter ON Pet(shelter_id);
CREATE INDEX idx_staff_shelter ON Staff(shelter_id);
CREATE INDEX idx_application_adopter ON Application(adopter_id);
CREATE INDEX idx_application_status ON Application(status);
CREATE INDEX idx_adoption_adopter ON Adoption(adopter_id);
CREATE INDEX idx_adoption_pet ON Adoption(pet_id);

-- Insert sample data for Shelters
INSERT INTO Shelter (name, address, city, phone, capacity) VALUES
('Happy Paws Shelter', '123 Main St', 'Bangalore', '080-12345678', 50),
('Caring Hearts Animal Center', '456 Oak Ave', 'Mumbai', '022-87654321', 75),
('Forever Home Sanctuary', '789 Pine Rd', 'Delhi', '011-11223344', 100);

-- Insert sample data for Adopters
INSERT INTO Adopter (first_name, last_name, phone, email, address, housing_type, has_yard) VALUES
('Rajesh', 'Kumar', '9876543210', 'rajesh.kumar@email.com', '12 MG Road, Bangalore', 'house', TRUE),
('Priya', 'Sharma', '9876543211', 'priya.sharma@email.com', '45 Park Street, Mumbai', 'apartment', FALSE),
('Amit', 'Patel', '9876543212', 'amit.patel@email.com', '78 Gandhi Nagar, Delhi', 'condo', TRUE);

-- Insert sample data for Pets
INSERT INTO Pet (name, breed, age, gender, color, species, weight, size, status, shelter_id) VALUES
('Buddy', 'Labrador', 2, 'Male', 'Golden', 'Dog', 25.5, 'Large', 'Available', 1),
('Whiskers', 'Persian', 1, 'Female', 'White', 'Cat', 4.2, 'Small', 'Available', 1),
('Max', 'German Shepherd', 3, 'Male', 'Brown', 'Dog', 32.0, 'Large', 'Available', 2),
('Luna', 'Siamese', 2, 'Female', 'Cream', 'Cat', 3.8, 'Small', 'Adopted', 2),
('Rocky', 'Beagle', 4, 'Male', 'Tricolor', 'Dog', 12.5, 'Medium', 'Available', 3);

-- Insert sample data for Staff
INSERT INTO Staff (first_name, last_name, email, role, hire_date, shelter_id) VALUES
('Dr. Anita', 'Reddy', 'anita.reddy@shelter.com', 'Veterinarian', '2020-01-15', 1),
('Suresh', 'Nair', 'suresh.nair@shelter.com', 'Manager', '2019-06-01', 1),
('Lakshmi', 'Iyer', 'lakshmi.iyer@shelter.com', 'Caretaker', '2021-03-10', 2),
('Vikram', 'Singh', 'vikram.singh@shelter.com', 'Administrator', '2018-11-20', 3);

-- Insert sample data for Applications
INSERT INTO Application (adopter_id, application_date, status, preferred_pet_age, experience_level) VALUES
(1, '2025-10-15', 'Approved', 'Adult', 'Experienced'),
(2, '2025-10-20', 'Pending', 'Young', 'Some Experience'),
(3, '2025-10-25', 'Under Review', 'Any', 'First Time');

-- Insert sample data for Adoptions
INSERT INTO Adoption (adopter_id, pet_id, adoption_date, adoption_fee, notes, status) VALUES
(2, 4, '2025-10-22', 5000.00, 'Luna is a friendly cat, good with children', 'Completed');