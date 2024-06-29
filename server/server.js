const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');


const app = express();
const PORT = process.env.PORT || 5500;
const usersPath = path.join(__dirname, './data/users.json');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/public')));

// Function to read users from JSON file
const readUsers = () => {
  try {
    const data = fs.readFileSync(usersPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

// Function to write users to JSON file
const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users:', error);
  }
};

app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const users = readUsers();

  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.json({ success: false, message: 'Username already taken' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Add new user to users array
  users.push({ username, email, password: hashedPassword });
  writeUsers(users);

  // Send success response
  res.json({ success: true, message: 'Signup successful' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  // Find user by username
  const user = users.find(user => user.username === username);
  if (user) {
    // Compare the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Successful login
      return res.json({ success: true });
    } else {
      // Invalid password
      return res.json({ success: false, message: 'Invalid username or password' });
    }
  } else {
    // Invalid username
    return res.json({ success: false, message: 'Invalid username or password' });
  }
});


// Catch-all handler to serve the frontend's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  <div>server is running successfully</div>
});

console.log("server is running fine");
