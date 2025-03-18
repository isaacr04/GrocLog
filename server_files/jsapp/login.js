//Functions to verify user login,

const users = require('./users');

console.log("Accessing login.js...");

function loginAttempt(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    else{
        return JSON.stringify({message: "hi!",user:username,pw:password})
    }

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
}
