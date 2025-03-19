//Functions needed to access and manage users  table in MySQL database

const db = require('./db');

console.log('Accessing users.js...');

//Stores json version of SQL query results in res
function getUsers(req, res) {
    const query = 'SELECT * FROM users';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error searching users:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
}

// Takes info from req and returns a message in res
function addUser(req, res) {
    const { username, password, perm } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO users (username, password, perm) VALUES (?, ?, ?)';
    db.query(query, [username, password, perm], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'User added successfully', id: result.insertId });
    });
}

function deleteUser(req, res) {
    const user_id   = req.user_id;
    console.log('User_id to delete: ${user_id}');

    if (!user_id) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'DELETE FROM users WHERE user_id=${user_id}';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'User deleted successfully'});
    });
}

async function getID(req, res){
    const { user, pw } = req.body;
    if (!user || !pw) {
        return res.status(400).json({code: -1});
    }

    const query = 'SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1';
    try {
        const [rows] = await db.promise().query(query, [user, pw]);
        if (rows.length === 0) {
            console.log("Error: No user found or incorrect password");
            return res.status(400).json({ id: -1 });
        } else {
            console.log("No error, user exists with correct password");
            console.log("Result (perm):", rows[0].perm);
            console.log("User id to return: ",rows[0].user_id)
            if( rows[0].perm === 1) {
                return res.status(400).json({ id: -1 });
            }
            else{
                return res.status(200).json({id: rows[0].user_id})
            }
        }
    }
    catch (error) {
        console.error("Database error:", error);
        return -1;
    }

}

module.exports = {
    getUsers,
    addUser,
    deleteUser,
    getID,
}