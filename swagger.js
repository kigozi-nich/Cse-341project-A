const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'Books Api',
        description: 'Books Api'
    },
    host: 'cse-341project-a.onrender.com',
    schemes: ['https', 'http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// This will generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);