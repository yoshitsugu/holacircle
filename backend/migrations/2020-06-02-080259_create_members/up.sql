CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  role_id INT NOT NULL REFERENCES roles (id),
  user_id INT NOT NULL REFERENCES users (id)
)
