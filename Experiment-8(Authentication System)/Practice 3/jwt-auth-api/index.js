const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_super_secret_key_123';

app.use(express.json());


const mockUsers = [
  {
    id: 1,
    username: 'adminUser',
    password: 'admin123',
    role: 'Admin'
  },
  {
    id: 2,
    username: 'modUser',
    password: 'mod123',
    role: 'Moderator'
  },
  {
    id: 3,
    username: 'basicUser',
    password: 'user123',
    role: 'User'
  }
];


app.post('/login', (req, res) => {

  const { username, password } = req.body;
  const user = mockUsers.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role  
  };


  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

  
  res.status(200).json({ token: token });
});


function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    
    req.user = user;
    next();
  });
}


function checkRole(requiredRole) {
  return (req, res, next) => {
    
    if (req.user.role !== requiredRole) {
      
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    
    next();
  };
}




app.get('/admin-dashboard', verifyToken, checkRole('Admin'), (req, res) => {
  
  res.status(200).json({
    message: 'Welcome to the Admin dashboard',
    user: req.user
  });
});


app.get('/moderator-panel', verifyToken, checkRole('Moderator'), (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Moderator panel',
    user: req.user
  });
});


app.get('/user-profile', verifyToken, (req, res) => {
 
  res.status(200).json({
    message: `Welcome to your profile, ${req.user.username}`,
    user: req.user
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});