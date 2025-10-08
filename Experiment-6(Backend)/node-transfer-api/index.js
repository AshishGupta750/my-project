const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;


app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/bank')
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => console.error('Connection error', err));


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    balance: { type: Number, required: true, min: 0 }
});

const User = mongoose.model('User', userSchema);


 
app.post('/create-users', async (req, res) => {
    try {
        await User.deleteMany({}); 
        const users = await User.create([
            { name: 'Alice', balance: 1000 },
            { name: 'Bob', balance: 500 }
        ]);
        res.status(201).json({ message: 'Users created.', users });
    } catch (error) {
        res.status(500).json({ message: 'Error creating users.', error: error.message });
    }
});



app.post('/transfer', async (req, res) => {
    const { fromUserID, toUserID, amount } = req.body;

    if (!fromUserID || !toUserID || !amount) {
        return res.status(400).json({ message: 'Missing required fields: fromUserID, toUserID, amount.' });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number.' });
    }

    try {

        const sender = await User.findById(fromUserID);
        const receiver = await User.findById(toUserID);

      
        if (!sender || !receiver) {
            return res.status(404).json({ message: 'One or both users not found.' });
        }


        if (sender.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance.' });
        }


        sender.balance -= amount;
        receiver.balance += amount;

   
        await sender.save();
        await receiver.save();

       
        res.status(200).json({
            message: `Transferred $${amount} from ${sender.name} to ${receiver.name}.`,
            senderBalance: sender.balance,
            receiverBalance: receiver.balance
        });

    } catch (error) {
        
        res.status(500).json({ message: 'An error occurred during the transfer.', error: error.message });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});