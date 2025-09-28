const routes = require('express').Router(); 

routes.use('/', require('./swagger')); 

routes.get('/', (req, res) => {
    //swagger.Tags = ['Hello World'];
  res.send('Hello, World!');
});

routes.use('/books', require('./books'));

module.exports = routes;