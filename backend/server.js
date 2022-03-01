const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./app/config/db.config');
const app = express();
// middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to inventory application.' });
});

app.use(require('./app/routes'));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
