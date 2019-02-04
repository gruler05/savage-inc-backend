const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({
    path: '.env'
});

const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

//  Todo use express middleware to handle cookies 
server.express.use(cookieParser());

// decode the JWT so we can use the user ID on each request

server.express.use((req, res, next) => {
    const {
        token
    } = req.cookies;
    if (token) {
        const {
            userId
        } = jwt.verify(token, process.env.APP_SECRET);
        // put the userId onto the req for future request to access
        req.userId = userId;
    }
    next();
});

server.start({
        cors: {
            credentials: true,
            origin: process.env.FRONTEND_URL,
        },
    },
    deets => {
        console.log(`Server is now running on port ${deets.port}`)
    })