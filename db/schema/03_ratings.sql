DROP TABLE IF EXISTS ratings CASCADE;

CREATE TABLE ratings(
  id SERIAL PRIMARY KEY NOT NULL,
  pin_id INTEGER REFERENCES pins(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  accessible_parking BOOLEAN DEFAULT FALSE,
  accessible_washroom BOOLEAN DEFAULT FALSE,
  alternative_entrance BOOLEAN DEFAULT FALSE,
  automatic_door BOOLEAN DEFAULT FALSE,
  elevator BOOLEAN DEFAULT FALSE,
  braille BOOLEAN DEFAULT FALSE,
  gender_neutral_washroom BOOLEAN DEFAULT FALSE,
  large_print BOOLEAN DEFAULT FALSE,
  outdoor_access_only BOOLEAN DEFAULT FALSE,
  quiet BOOLEAN DEFAULT FALSE,
  ramp BOOLEAN DEFAULT FALSE,
  scent_free BOOLEAN DEFAULT FALSE,
  service_animal_friendly BOOLEAN DEFAULT FALSE,
  sign_language BOOLEAN DEFAULT FALSE,
  spacious BOOLEAN DEFAULT FALSE,
  stopgap_ramp BOOLEAN DEFAULT FALSE,
  date TIMESTAMP DEFAULT NOW()
)
