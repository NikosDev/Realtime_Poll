const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// DB Config
require('./config/db');

const poll = require('./routes/poll');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

app.use('/poll', poll);
/* app.get('/', function(req, res, next){
    res.sendStatus(200);
}); */

const port = 3000;

// Start server
app.listen(process.env.PORT || port, () => console.log(`Server started on port ${port}`));