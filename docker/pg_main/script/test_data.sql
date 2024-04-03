INSERT INTO users (id, wallet_address, phone_number, created_at)
VALUES (755464644, 'Aj6bHDqZCJZY5ScPszwhebww1tBNsG5ZyS5Pj1gTAqvf', '1234567890', '2021-01-01 00:00:00');

INSERT INTO users (id, wallet_address, phone_number, created_at)
VALUES (318120426, 'By4npNcMSjrztXttXFs9sXZDQ8hLsMF7kaEUPCnWJLea', '2345678901', '2021-01-01 00:00:00');

INSERT INTO users (id, wallet_address, phone_number, created_at)
VALUES (543366311, '3ukex7VYt1zJxw5qJMy5bo5ppEA1Dmx14ZYQ2EEeWa6B', '3456789012', '2021-01-01 00:00:00');

INSERT INTO admins (user_id, username, firstname, secondname, email, phone, password, created_at)
VALUES (755464644, 'admin_1', 'admin_name', 'admin_secondname', 'admin@email', '1234567890', 'admin_password', '2021-01-01 00:00:00');

INSERT INTO institutions (admin_id, name, location, description, created_at)
VALUES (1, 'Yidalnya', 'USA, Pentagon, 3 2/4', 'Yidalnya in Pentagon', '2021-01-01 00:00:00');

INSERT INTO institution_offers (institution_id, name, description, price, created_at)
VALUES (1, 'Halushky', 'Halushky from Yidalnya in Pentagon', 100.0000, '2021-01-01 00:00:00');

INSERT INTO institution_staff (institution_id, user_id, created_at)
VALUES (1, 2116893648, '2021-01-01 00:00:00');
