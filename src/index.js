require('dotenv').config({
    path: '.env'
});

const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

//  Todo use express middleware to handle cookies 


// Todo use express middleware to populate current user


server.start({
        cors: {
            credentials: true,
            origin: process.env.FRONTEND_URL,
        },
    },
    deets => {
        console.log(`Server is now running on port ${deets.port}`)
    })