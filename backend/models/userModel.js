
const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'users.json');
let users = [];

// Load existing users
if (fs.existsSync(FILE_PATH)) {
    users = JSON.parse(fs.readFileSync(FILE_PATH));
}

function saveToFile() {
    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));
}

module.exports = {
    users,
    saveToFile
};