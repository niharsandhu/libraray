const express = require('express');
const router = express.Router();   
//folllows mvc patttern model view controller 
const resources = require('../models/resourceModel');

// GET - Get all resources
router.get('/resources', (req, res) => {
    res.json(resources);
});

// GET - Get single resource
router.get('/resources/:id', (req, res) => {
    const resource = resources.find(r => r.id === req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json(resource);
});

// POST - Create resource
router.post('/resources', (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) return res.status(400).json({ error: 'Missing required fields' });
    
    const resource = {
        id: Date.now().toString(),
        name,
        description
    };
    resources.push(resource);
    res.status(201).json(resource);
});

// PUT - Update resource
router.put('/resources/:id', (req, res) => {
    const { name, description } = req.body;
    const resource = resources.find(r => r.id === req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    
    if (name) resource.name = name;
    if (description) resource.description = description;
    res.json(resource);
});

// DELETE - Delete resource
router.delete('/resources/:id', (req, res) => {
    const index = resources.findIndex(r => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Resource not found' });
    
    resources.splice(index, 1);
    res.json({ message: 'Resource deleted' });
});

module.exports = router;
