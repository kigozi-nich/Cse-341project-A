const routes = require('express').Router(); 
routes.use('/', require('./swagger')); 
routes.get('/', (req, res) => {
    //swagger.Tags = ['Hello World'];
  res.send('Hello, World!');
});

routes.get('/login', (req, res) => {
  res.redirect('/github');
});

routes.use('/books', require('./books'));
routes.use('/authors', require('./authors'));

module.exports = routes;