-- ============================================================
--  SAMPLE DATA FOR TESTING
--  Run this script AFTER schema.sql, in MySQL Workbench
-- ============================================================
USE vehicle_service;

-- Customers
INSERT INTO customers (name, phone, email, address) VALUES
('Rahul Sharma',  '9876543210', 'rahul@example.com',  '12 MG Road, Pune'),
('Priya Patel',  '9876500011', 'priya@example.com',  '45 Nehru Nagar, Nashik'),
('Amit Verma',   '9876500022', 'amit@example.com',   '78 Station Road, Mumbai'),
('Sneha Joshi',  '9876500033', 'sneha@example.com',  '9 Park Street, Nagpur'),
('Vikram Singh', '9876500044', 'vikram@example.com', '21 Lake View, Thane');

-- Vehicles
INSERT INTO vehicles (customer_id, vehicle_number, vehicle_model, vehicle_type) VALUES
(1, 'MH12AB1234', 'Maruti Swift VXi',  'Car'),
(1, 'MH12XY9876', 'Honda City ZX',     'Car'),
(2, 'MH14CD4567', 'Royal Enfield Classic', 'Motorcycle'),
(3, 'MH01EF7890', 'Tata Nexon EV',    'Car'),
(4, 'MH02GH2345', 'Hyundai Creta SX', 'SUV'),
(5, 'MH03IJ6789', 'Bajaj Pulsar 220', 'Motorcycle');

-- Service records
INSERT INTO services (vehicle_id, service_date, service_type, description, status, cost) VALUES
(1, '2026-01-12', 'Periodic Service', 'Engine oil and filter change',        'Completed', 4500.00),
(1, '2026-02-20', 'Tyre Replacement','Two front tyres replaced',             'Completed', 6200.00),
(2, '2026-03-05', 'Brake Service',    'Front brake pads replaced',            'In Progress', 1800.00),
(3, '2026-03-11', 'Bike Service',     'Full service and chain lubrication',   'Pending',     1500.00),
(4, '2026-03-15', 'Battery Replace',  'New 45Ah battery installed',           'Completed', 7200.00),
(5, '2026-03-21', 'AC Service',       'AC gas refill and cabin filter',       'Pending',     2500.00),
(6, '2026-03-25', 'General Repair',   'Clutch cable replacement',             'In Progress', 900.00);