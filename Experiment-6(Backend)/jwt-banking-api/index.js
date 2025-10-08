const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-super-secret-key-that-is-long-and-secure'; 


app.use(express.json());


const users = [
    {
        id: 1,
        username: 'user1',
        password: 'password123'
    }
];

let accountBalance = 1000; 

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }

    return next();
};



app.post('/login', (req, res) => {
    const { username, password } = req.body;


    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
     
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' } 
        );
        res.status(200).json({ token });
    } else {
       
        res.status(401).json({ message: 'Invalid credentials' });
    }
});


app.get('/balance', verifyToken, (req, res) => {
    res.status(200).json({ balance: accountBalance });
});


app.post('/deposit', verifyToken, (req, res) => {
    const { amount } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid deposit amount' });
    }

    accountBalance += amount;
    res.status(200).json({ message: `Deposited $${amount}`, newBalance: accountBalance });
});


app.post('/withdraw', verifyToken, (req, res) => {
    const { amount } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }

    if (amount > accountBalance) {
        return res.status(400).json({ message: 'Insufficient funds' });
    }

    accountBalance -= amount;
    res.status(200).json({ message: `Withdrew $${amount}`, newBalance: accountBalance });
});


app.listen(PORT, () => {
    console.log(`Banking API server is running on http://localhost:${PORT}`);
});