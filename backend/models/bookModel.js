const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'books.json');
let books = [];

// Initialize data from file
function initialize() {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, 'utf8');
      books = JSON.parse(data);
    } else {
      fs.writeFileSync(FILE_PATH, '[]');
    }
  } catch (err) {
    console.error('Error initializing book data:', err);
    books = [];
  }
}

// Save current books to file
function saveToFile() {
  fs.writeFileSync(FILE_PATH, JSON.stringify(books, null, 2));
}

// Generate sequential IDs starting from 1
function getNextId() {
  if (books.length === 0) return 1;
  const maxId = Math.max(...books.map(book => parseInt(book.id)));
  return maxId + 1;
}

// Initialize on startup
initialize();

module.exports = {
  books, // The actual array of books
  saveToFile,
  getNextId
};