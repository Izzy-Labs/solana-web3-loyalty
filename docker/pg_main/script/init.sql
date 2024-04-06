CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255),
    wallet_address VARCHAR(44) NOT NULL,
    phone_number VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    user_id SERIAL,
    username VARCHAR(255),
    firstname VARCHAR(255) NOT NULL,
    secondname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id),
    UNIQUE (email),
    UNIQUE (phone),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE  IF NOT EXISTS institutions (
    id SERIAL PRIMARY KEY,
    admin_id SERIAL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (name, location),
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

CREATE TABLE IF NOT EXISTS institution_staff (
    id SERIAL PRIMARY KEY,
    institution_id SERIAL,
    user_id SERIAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (institution_id, user_id),
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS institution_offers (
    id SERIAL PRIMARY KEY,
    institution_id SERIAL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (institution_id) REFERENCES institutions(id)
);


CREATE ROLE visitor_tg_role;
GRANT SELECT ON TABLE institutions TO visitor_tg_role;
GRANT SELECT ON TABLE institution_staff TO visitor_tg_role;
GRANT SELECT ON TABLE institution_offers TO visitor_tg_role;
GRANT SELECT, INSERT, UPDATE ON TABLE users TO visitor_tg_role;

CREATE ROLE visitor_web_role;
GRANT SELECT ON TABLE users TO visitor_web_role;
GRANT SELECT ON TABLE institution_offers TO visitor_web_role;

CREATE ROLE staff_web_role;
GRANT SELECT ON TABLE users TO staff_web_role;
GRANT SELECT ON TABLE institutions TO staff_web_role;
GRANT SELECT ON TABLE institution_staff TO staff_web_role;
GRANT SELECT ON TABLE institution_offers TO staff_web_role;

CREATE ROLE admin_web_role;
GRANT SELECT, INSERT, UPDATE ON TABLE admins TO admin_web_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE institutions TO admin_web_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE institution_staff TO admin_web_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE institution_offers TO admin_web_role;