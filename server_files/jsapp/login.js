//Functions to verify user login,

const users = require('./users');

console.log("Accessing login.js...");

function loginAttempt(req, res){
    console.log(req.body)
    const { user, pw } = req.body;
    console.log("username: ",user)
    console.log("password: ",pw)
    if (!user || !pw) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    let validLogin = validate(user,pw)
    else{
        res.redirect('/itemlog');
    }

    //const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
}

module.exports = {
    loginAttempt
}