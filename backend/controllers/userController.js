const { users, saveToFile } = require('../models/userModel');
const { borrowedBooks } = require('../models/borrowedBookModel');

// Helper to generate sequential IDs
const getNextUserId = () => {
  return users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) + 1 : 1;
};

// Get all users
exports.getAllUsers = (req, res, next) => {
  try {
    res.send(users);
  } catch (error) {
    next(error);
  }
};

// Get single user
exports.getUserById = (req, res, next) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.send(user);
  } catch (error) {
    next(error);
  }
};

exports.createUser = (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;
  
      if (!name || !email || !password || !role) {
        return res.status(400).json({
          error: 'Name, email, password, and role are required'
        });
      }
  
      const newUser = {
        id: getNextUserId().toString(),
        name,
        email,
        password, 
        role     
      };
  
      users.push(newUser);
      saveToFile();
  
      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role 
        }
      });
    } catch (error) {
      next(error);
    }
  };
  

exports.updateUser = (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;
      const user = users.find(u => u.id === req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;
      if (role) user.role = role;
  
      saveToFile();
      res.send({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      next(error);
    }
  };
  

// Delete user
exports.deleteUser = (req, res, next) => {
  try {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hasBorrowedBooks = borrowedBooks.some(b =>
      b.userId === req.params.id && b.status === "borrowed"
    );

    if (hasBorrowedBooks) {
      return res.status(400).json({ error: 'Cannot delete user with borrowed books' });
    }

    users.splice(index, 1);
    saveToFile();

    res.json({
      message: 'User deleted successfully',
      deletedId: req.params.id
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.loginUser = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Don't return password in response
    const { id, name, role } = user;

    res.json({
      message: 'Login successful',
      user: { id, name, email, role }
    });

  } catch (error) {
    next(error);
  }
};
