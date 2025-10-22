const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;


const SECRET_KEY = 'your_super_secret_key_123';


app.use(express.json());


const mockUser = {
  id: 1,
  username: 'testuser',
  password: 'password123'
};


app.post('/login', (req, res) => {

  const { username, password } = req.body;


  if (username === mockUser.username && password === mockUser.password) {
    

    const payload = { 
      id: mockUser.id, 
      username: mockUser.username 
    };


    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    
    res.status(200).json({ token: token });

  } else {
    
    res.status(401).json({ message: 'Invalid username or password' });
  }
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


app.get('/protected', verifyToken, (req, res) => {
  
  res.status(200).json({
    message: 'You have accessed a protected route!',
    user: req.user
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});