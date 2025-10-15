CREATE TABLE ngo (
  ngo_id INT AUTO_INCREMENT PRIMARY KEY,
  ngo_name VARCHAR(120) NOT NULL,
  hq_location VARCHAR(120),
  contact_email VARCHAR(190)
);

CREATE TABLE event (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  ngo_id INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  purpose VARCHAR(255),
  full_description TEXT,
  location VARCHAR(160),
  start_date DATETIME,
  end_date DATETIME,
  ticket_price DECIMAL(10,2) DEFAULT 0.00,
  currency CHAR(3) DEFAULT 'AUD',
  goal_amount DECIMAL(12,2),
  progress_amount DECIMAL(12,2) DEFAULT 0.00,
  image_url VARCHAR(255),
  category VARCHAR(80),
  status ENUM('draft','active','suspended','finished') DEFAULT 'draft',
  CONSTRAINT fk_event_ngo FOREIGN KEY (ngo_id) REFERENCES ngo(ngo_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE registration (
  registration_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190),
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  payment_status ENUM('paid','pending','free') DEFAULT 'free',
  CONSTRAINT fk_reg_event FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
);


INSERT INTO ngo (ngo_name, hq_location, contact_email) VALUES
('Aurora Relief', 'Darwin, Australia', 'contact@aurorarelief.org'),
('Seabird Conservation Alliance', 'Hobart, Australia', 'info@seabirdalliance.org'),
('Horizon Health Network', 'Adelaide, Australia', 'hello@horizonhealth.org');

INSERT INTO event (ngo_id, name, purpose, full_description, location, start_date, end_date, ticket_price, currency, goal_amount, progress_amount, status, category, image_url) VALUES
(1, 'Outback Astronomy Night', 'Fund science kits for rural schools', 'A guided stargazing session in the desert with expert astronomers.', 'Alice Springs Desert Park, NT', '2025-05-21 19:00:00', '2025-05-21 23:00:00', 45.00, 'AUD', 10000.00, 3200.00, 'active', 'Science & Education', 'https://images.pexels.com/photos/2897499/pexels-photo-2897499.jpeg'),
(1, 'Mangrove Kayak Challenge', 'Support coastal restoration', 'Teams kayak through mangrove channels, raising awareness for habitat protection.', 'Darwin Harbour, NT', '2025-08-15 08:00:00', '2025-08-15 12:00:00', 25.00, 'AUD', 8000.00, 2100.00, 'active', 'Environment & Conservation', 'https://images.pexels.com/photos/34155375/pexels-photo-34155375.jpeg'),
(1, 'Desert Film Screening', 'Provide solar lamps to remote communities', 'Open-air screening of independent desert-themed films.', 'Araluen Arts Centre, Alice Springs', '2025-09-10 18:00:00', '2025-09-10 21:00:00', 15.00, 'AUD', 5000.00, 1000.00, 'draft', 'Arts & Culture', 'https://images.pexels.com/photos/27020087/pexels-photo-27020087.jpeg'),
(2, 'Penguin Parade Charity Walk', 'Raise funds for seabird sanctuaries', 'Evening walk alongside penguin colonies with conservation experts.', 'Phillip Island, VIC', '2025-07-03 16:00:00', '2025-07-03 19:00:00', 20.00, 'AUD', 7000.00, 2500.00, 'active', 'Environment & Conservation', 'https://images.pexels.com/photos/17586141/pexels-photo-17586141.jpeg'),
(2, 'Seabird Sketch Exhibition', 'Art therapy for coastal communities', 'Exhibition of sketches and paintings featuring seabirds by local artists.', 'Tasmanian Museum and Art Gallery, Hobart', '2025-10-19 10:00:00', '2025-10-19 17:00:00', 30.00, 'AUD', 6000.00, 1200.00, 'active', 'Arts & Culture', 'https://images.pexels.com/photos/32616821/pexels-photo-32616821.jpeg'),
(2, 'Harbour Lighthouse Gala', 'Restore historic lighthouse facilities', 'Formal dinner and auction held at a lighthouse.', 'Cape Bruny Lighthouse, TAS', '2025-12-02 18:00:00', '2025-12-02 23:30:00', 100.00, 'AUD', 20000.00, 5000.00, 'draft', 'Fundraising Gala', 'https://images.pexels.com/photos/31803428/pexels-photo-31803428.jpeg'),
(3, 'Rainforest Tree Planting', 'Plant 5000 trees in degraded areas', 'Volunteer-led planting of native rainforest species.', 'Daintree Rainforest, QLD', '2025-06-12 09:00:00', '2025-06-12 15:00:00', 0.00, 'AUD', 12000.00, 4000.00, 'active', 'Environment & Conservation', 'https://images.pexels.com/photos/17201892/pexels-photo-17201892.jpeg'),
(3, 'Coral Reef Concert', 'Support reef clean-up programs', 'Live music on the beach with proceeds to coral reef projects.', 'Cairns Esplanade, QLD', '2025-11-04 17:00:00', '2025-11-04 21:00:00', 60.00, 'AUD', 15000.00, 5200.00, 'active', 'Arts & Culture', 'https://images.pexels.com/photos/17583739/pexels-photo-17583739.jpeg'),
(3, 'Midnight Library Readathon', 'Fund mobile libraries', 'Participants read aloud all night in a symbolic marathon.', 'Adelaide City Library, SA', '2025-09-25 20:00:00', '2025-09-26 08:00:00', 10.00, 'AUD', 4000.00, 1900.00, 'active', 'Science & Education', 'https://images.pexels.com/photos/25375715/pexels-photo-25375715.jpeg'),
(3, 'Vintage Train Ride for Charity', 'Support mental health helplines', 'A heritage train ride experience through scenic routes.', 'Belair Line, Adelaide Hills, SA', '2025-10-05 10:00:00', '2025-10-05 15:00:00', 70.00, 'AUD', 18000.00, 6400.00, 'active', 'Heritage & Community', 'https://images.pexels.com/photos/31593763/pexels-photo-31593763.jpeg'),
(3, 'Starlight Coding Hackathon', 'Fund youth coding bootcamps', '48-hour hackathon with mentorship, supporting young coders.', 'Innovation Hub, Adelaide, SA', '2025-11-18 09:00:00', '2025-11-19 21:00:00', 35.00, 'AUD', 9000.00, 3000.00, 'active', 'Technology & Innovation', 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg');

INSERT INTO registration (event_id, full_name, email, payment_status) VALUES
(1, 'Quentin Zhao', 'quentin.zhao@gmail.com', 'paid'),
(1, 'Marisol Ortega', 'marisol.ortega@gmail.com', 'pending'),
(2, 'Leif Gunnarsson', 'leif.gunnarsson@gmail.com', 'paid'),
(2, 'Soraya El-Amin', 'soraya.elamin@gmail.com', 'free'),
(2, 'Takumi Arai', 'takumi.arai@gmail.com', 'paid'),
(3, 'Beatrix Novák', 'beatrix.novak@gmail.com', 'pending'),
(3, 'Oluwaseun Adeyemi', 'oluwaseun.adeyemi@gmail.com', 'paid'),
(4, 'Yara Haddad', 'yara.haddad@gmail.com', 'paid'),
(4, 'Mateo Ferreira', 'mateo.ferreira@gmail.com', 'free'),
(5, 'Svetlana Kuznetsova', 'svetlana.k@gmail.com', 'paid'),
(5, 'Ibrahim Diallo', 'ibrahim.diallo@gmail.com', 'pending'),
(6, 'Chike Obi', 'chike.obi@gmail.com', 'paid'),
(7, 'Nia Mbatha', 'nia.mbatha@gmail.com', 'free'),
(7, 'Hideo Sato', 'hideo.sato@gmail.com', 'paid'),
(8, 'Anouk van Dijk', 'anouk.vandijk@gmail.com', 'pending'),
(8, 'Kofi Mensah', 'kofi.mensah@gmail.com', 'paid'),
(9, 'Giulia Romano', 'giulia.romano@gmail.com', 'paid'),
(9, 'Linh Tran', 'linh.tran@gmail.com', 'pending'),
(10, 'Tomasz Zielinski', 'tomasz.zielinski@gmail.com', 'paid'),
(10, 'Fatima Noor', 'fatima.noor@gmail.com', 'free'),
(11, 'Jonas Bergström', 'jonas.bergstrom@gmail.com', 'paid'),
(11, 'Ayesha Rahman', 'ayesha.rahman@gmail.com', 'pending');
