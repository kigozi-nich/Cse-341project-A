const route = require('express').Router();

route.get('/', (req, res) => {
    res.send('Hello World!');
});

route.use('/books',require('./books'));



module.exports = route;

    