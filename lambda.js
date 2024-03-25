const serverless = require('serverless-http');
const app = require('./app'); // Adjust this path if your Express app is defined in another file
module.exports.handler = serverless(app);
