const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'reservations.json');

// Initialize with empty array or load existing
let reservations = [];

if (fs.existsSync(FILE_PATH)) {
  reservations = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
}

function saveToFile() {
  fs.writeFileSync(FILE_PATH, JSON.stringify(reservations, null, 2));
}

module.exports = {
  reservations,
  saveToFile
};