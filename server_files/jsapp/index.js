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
app.post('/itemlog/add', itemlog.addItem);
app.post('/itemlog/search', itemlog.searchItems);
app.post('/itemlog/delete', itemlog.deleteItem);
app.post('/itemlog/edit', itemlog.editItem);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});