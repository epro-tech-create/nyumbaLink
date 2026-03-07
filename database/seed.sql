-- Optional seed: create admin user (password: admin123)
-- Run after schema. Password hash for 'admin123' with bcrypt.
-- INSERT INTO users (email, password_hash, full_name, role) VALUES
-- ('admin@nyumbalink.com', '$2a$10$rQnM1.VxWxGxWxWxWxWxWuOqKz8Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y', 'Admin User', 'admin');

-- To generate a real hash, use: node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10));"
