

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'borrowed-books.json');

// Initialize with empty array
let borrowedBooks = [];

// Load data from file if exists
if (fs.existsSync(FILE_PATH)) {
  const data = fs.readFileSync(FILE_PATH, 'utf8');
  borrowedBooks = JSON.parse(data);
}

function saveToFile() {
  fs.writeFileSync(FILE_PATH, JSON.stringify(borrowedBooks, null, 2));
}

module.exports = {
  borrowedBooks, // This is the array
  saveToFile
};