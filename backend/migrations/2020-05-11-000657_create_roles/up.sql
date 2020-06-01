CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES clients (id),
  role_id INT REFERENCES roles (id),
  name VARCHAR NOT NULL,
  is_circle BOOLEAN NOT NULL DEFAULT FALSE,
  purpose TEXT NOT NULL,
  domains TEXT NOT NULL,
  accountabilities TEXT NOT NULL
)
