//import {addTrip, getTrip, updateTrip, updateTripFields, searchTrip, exactMatchTripFields, partiallyMatchTripFields} from './services/tripService.js';
const express = require('express');
const Redis = require('redis');
const bodyParser = require('body-parser');
const cors = require('cors');
const { addOrderItemId } = require('./services/orderItemServices.js');

const app = express();
const port = 3001;

// Redis client setup
const redisClient = Redis.createClient({
    url: 'redis://localhost:6379'
});

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000"
}));

// Connect to Redis and start the server
app.listen(port, async () => {
    try {
        await redisClient.connect();
        console.log(`API is listening on port: ${port}`);
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
});

// POST endpoint to add a new order item
app.post('/orderItems', async (req, res) => {
    const orderItem = req.body;
    const requiredFields = ['orderItemId', 'orderId', 'productId', 'quantity'];
    const missingFields = requiredFields.filter(field => !orderItem[field]);

    if (missingFields.length === 0) {
        try {
            const uniqueKey = await addOrderItemId({redisClient, orderItem});
            console.log(`Order item added with unique key:`,orderItem);
            res.status(201).send("New orderItem has been created.");
        } catch (error) {
            console.error("Failed to add order item:", error);
            res.status(500).send("Internal Server Error.");
        }
    } else {
        res.status(400).send(`Missing required fields: ${missingFields.join(', ')}.`);
    }
});

console.log(`Server running on port ${port}`);


// app.post('/boxes',async (req,res)=>{//async means we wait for the promise
//     const newBox = req.body;//created new box
//     newBox.id= parseInt(await redisClient.json.arrLen('boxes','$'))+1;// defult box id, user can't change it
//     await redisClient.json.arrAppend('boxes','$',newBox);//save the json in redis
//     res.json(newBox);//respond with the new box
// });

// app.get('/boxes', async (req,res)=>{//return boxes to the user\
//     let boxes = await redisClient.json.get('boxes',{path:'$'});//get the boxes
//     //send boxes to the browser
//     res.json(boxes[0]);//convert boes to a string
// }); //return boxes to user