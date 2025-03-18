//Functions to verify user login

const users = require('./users');
const secret = "never-gonna-give-you-up"

console.log("Accessing login.js...");

function loginAttempt(req, res){
    console.log(req.body)
    const { user, pw } = req.body;
    console.log("username: ",user)
    console.log("password: ",pw)
    if (!user || !pw) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    switch(validate(user,pw)) {
        case -1:
            return res.status(401).json({msg: 'Invalid login'}); break;
        case 0:
            return res.status(200).json({msg: 'Valid login for std user'}); break;
        case 1:
            return res.status(200).json({msg: 'Valid login for administrator'}); break;
    }

    //const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
}


function validate(user,pw){
    const query = 'SELECT * FROM users WHERE user_id = ? LIMIT 1';

    db.query(query, [username, password], (err, result) => {
        if (err) {
            return -1;
        }
        else{
            return result.perm;
    });
}
module.exports = {
    loginAttempt,
    validate
}