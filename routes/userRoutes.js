const express = require('express');
const router = express.Router();
const users = require('../models/userModel');


router.get('/users', (req, res) => 
{
    res.send(users);
});

// GET - Get single user
router.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.send(user);
});

// POST - Create user
router.post('/users', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Missing required fields' });
    
    const user = {
        id: Date.now().toString(),
        name,
        email
    };
    users.push(user);
    res.status(201).json(user);
});

// PUT - Update user
router.put('/users/:id', (req, res) => {
    const { name, email } = req.body;
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (name) user.name = name;
    if (email) user.email = email;
    res.send(user);
});

// DELETE - Delete user
router.delete('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    
    users.splice(index, 1);
    res.json({ message: 'User deleted' });
});

module.exports = router;
