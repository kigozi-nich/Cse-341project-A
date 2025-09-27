require('dotenv').config();
const express = require('express');
const db = require('./data/database');
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', require('./routes'));

db.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});
  }
});
