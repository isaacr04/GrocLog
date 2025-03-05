#!/usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const itemlog = require('./itemlog');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Routes for itemlog
app.post('/api/additem', itemlog.addItem);
app.post('/api/searchitem', itemlog.searchItems);
app.post('/api/deleteitem', itemlog.deleteItem);
app.post('/api/edititem', itemlog.editItem);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});