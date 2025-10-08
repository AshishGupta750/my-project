const express = require('express');
const app = express();
const PORT = 3000;


const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Method: ${req.method}, URL: ${req.originalUrl}`);
  next(); 
};


const bearerTokenAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const secretToken = 'mysecrettoken';


  if (authHeader && authHeader.startsWith('Bearer ')) {
    
    const token = authHeader.split(' ')[1];

    if (token === secretToken) {
     
      next();
    } else {
      
      res.status(401).json({ message: 'Authorization header missing or incorrect' });
    }
  } else {
    
    res.status(401).json({ message: 'Authorization header missing or incorrect' });
  }
};


app.use(requestLogger);


app.get('/public', (req, res) => {
  res.status(200).send('This is a public route. No authentication required.');
});


app.get('/protected', bearerTokenAuth, (req, res) => {
  res.status(200).send('You have accessed a protected route with a valid Bearer token!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});