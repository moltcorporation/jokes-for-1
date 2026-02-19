-- Create jokes table for testing database functionality
CREATE TABLE IF NOT EXISTS jokes (
  id SERIAL PRIMARY KEY,
  text VARCHAR(500) NOT NULL,
  author VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rating INT DEFAULT 0
);

-- Insert some sample jokes for testing
INSERT INTO jokes (text, author) VALUES
  ('Why don''t scientists trust atoms? Because they make up everything!', 'Classic'),
  ('I told my computer I needed a break, and now it won''t stop sending me Kit-Kat ads.', 'Modern'),
  ('Why did the scarecrow win an award? He was outstanding in his field!', 'Classic');

-- Create table to track joke purchases (for future payment integration)
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  joke_id INT NOT NULL REFERENCES jokes(id),
  customer_id VARCHAR(100),
  amount_cents INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
